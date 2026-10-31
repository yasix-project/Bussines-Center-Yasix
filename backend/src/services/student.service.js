// src/services/student.service.js
const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

/**
 * 1. Ambil Semua Data Siswa (dengan Pagination & Search)
 */
const getAllStudentsService = async ({ search, page = 1, limit = 10 }) => {
  const skip = (Number(page) - 1) * Number(limit);

  // Filter khusus role SISWA
  const whereCondition = {
    role: "SISWA",
    ...(search && {
      OR: [
        { name: { contains: search } },
        { nis: { contains: search } },
        { email: { contains: search } },
      ],
    }),
  };

  const [students, total] = await Promise.all([
    prisma.user.findMany({
      where: whereCondition,
      select: {
        id: true,
        nis: true,
        name: true,
        email: true,
        role: true,
        qrCodeMember: true,
        points: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: Number(skip),
      take: Number(limit),
    }),
    prisma.user.count({ where: whereCondition }),
  ]);

  return {
    students,
    pagination: {
      totalData: total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      limit: Number(limit),
    },
  };
};

/**
 * 2. Ambil Detail Siswa Berdasarkan ID atau NIS / QR Code
 */
const getStudentByIdService = async (idOrIdentifier) => {
  const student = await prisma.user.findFirst({
    where: {
      role: "SISWA",
      OR: [
        { id: idOrIdentifier },
        { nis: idOrIdentifier },
        { qrCodeMember: idOrIdentifier },
      ],
    },
    select: {
      id: true,
      nis: true,
      name: true,
      email: true,
      role: true,
      qrCodeMember: true,
      points: true,
      createdAt: true,
      updatedAt: true,
      printOrders: {
        take: 5,
        orderBy: { createdAt: "desc" },
      },
      vouchers: {
        where: { isActive: true },
      },
    },
  });

  if (!student) {
    throw new Error("Data siswa tidak ditemukan.");
  }

  return student;
};

/**
 * 3. Tambah Siswa Baru
 */
const createStudentService = async (data) => {
  const { name, email, password, nis, points } = data;

  // Cek keunikan email & NIS
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    throw new Error("Email sudah terdaftar.");
  }

  if (nis) {
    const existingNis = await prisma.user.findUnique({ where: { nis } });
    if (existingNis) {
      throw new Error("NIS sudah terdaftar.");
    }
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password || "12345678", 10);

  // Generate QR Member Code otomatis jika tidak diinput
  const generatedQrCode = data.qrCodeMember || `QR-YASX-${nis || Date.now()}`;

  const newStudent = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      nis: nis || null,
      role: "SISWA",
      qrCodeMember: generatedQrCode,
      points: points ? Number(points) : 0,
    },
    select: {
      id: true,
      nis: true,
      name: true,
      email: true,
      role: true,
      qrCodeMember: true,
      points: true,
      createdAt: true,
    },
  });

  return newStudent;
};

/**
 * 4. Update Data Siswa
 */
const updateStudentService = async (id, data) => {
  const existingStudent = await prisma.user.findFirst({
    where: { id, role: "SISWA" },
  });

  if (!existingStudent) {
    throw new Error("Siswa tidak ditemukan.");
  }

  const updateData = {};

  if (data.name) updateData.name = data.name;
  if (data.email) {
    const checkEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (checkEmail && checkEmail.id !== id) {
      throw new Error("Email sudah digunakan pengguna lain.");
    }
    updateData.email = data.email;
  }

  if (data.nis) {
    const checkNis = await prisma.user.findUnique({ where: { nis: data.nis } });
    if (checkNis && checkNis.id !== id) {
      throw new Error("NIS sudah digunakan siswa lain.");
    }
    updateData.nis = data.nis;
  }

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  if (data.points !== undefined && data.points !== null) {
    updateData.points = Number(data.points);
  }

  if (data.qrCodeMember) {
    updateData.qrCodeMember = data.qrCodeMember;
  }

  const updatedStudent = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      nis: true,
      name: true,
      email: true,
      role: true,
      qrCodeMember: true,
      points: true,
      updatedAt: true,
    },
  });

  return updatedStudent;
};

/**
 * 5. Hapus Data Siswa
 */
const deleteStudentService = async (id) => {
  const existingStudent = await prisma.user.findFirst({
    where: { id, role: "SISWA" },
  });

  if (!existingStudent) {
    throw new Error("Data siswa tidak ditemukan.");
  }

  await prisma.user.delete({
    where: { id },
  });

  return true;
};

/**
 * 6. Quick Update Point Siswa (Tambah/Kurang)
 */
const updateStudentPointsService = async (id, pointsDelta) => {
  const student = await prisma.user.findUnique({ where: { id } });
  if (!student) throw new Error("Siswa tidak ditemukan.");

  const newPoints = student.points + Number(pointsDelta);
  if (newPoints < 0) throw new Error("Jumlah poin tidak mencukupi.");

  return await prisma.user.update({
    where: { id },
    data: { points: newPoints },
    select: { id: true, name: true, points: true },
  });
};

module.exports = {
  getAllStudentsService,
  getStudentByIdService,
  createStudentService,
  updateStudentService,
  deleteStudentService,
  updateStudentPointsService,
};
