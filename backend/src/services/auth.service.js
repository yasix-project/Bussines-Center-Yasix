const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const loginService = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Email atau password salah.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Email atau password salah.");
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  const { password: _, ...userData } = user;
  return { user: userData, token };
};

const registerSiswaService = async (data) => {
  const { nis, name, email, password } = data;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { nis }],
    },
  });

  if (existingUser) {
    throw new Error("Email atau NIS sudah terdaftar.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const qrCodeMember = `MEMBER-${nis}`;

  const newSiswa = await prisma.user.create({
    data: {
      nis,
      name,
      email,
      password: hashedPassword,
      role: "SISWA",
      qrCodeMember,
    },
  });

  const { password: _, ...resultData } = newSiswa;
  return resultData;
};

const updateProfileService = async (userId, data) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new Error("Pengguna tidak ditemukan.");
  }

  const updatePayload = {};

  // 1. Update Nama
  if (data.name) {
    updatePayload.name = data.name;
  }

  // 2. Update Email (Cek Keunikan Email)
  if (data.email && data.email !== existingUser.email) {
    const emailTaken = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (emailTaken) {
      throw new Error("Email sudah digunakan oleh pengguna lain.");
    }
    updatePayload.email = data.email;
  }

  // 3. Update Password (jika diisi)
  if (data.password) {
    if (data.password.length < 6) {
      throw new Error("Password minimal harus 6 karakter.");
    }
    updatePayload.password = await bcrypt.hash(data.password, 10);
  }

  // Eksekusi Update ke Database
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updatePayload,
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

  return updatedUser;
};

module.exports = {
  loginService,
  registerSiswaService,
  updateProfileService,
};
