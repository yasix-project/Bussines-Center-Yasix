const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const loginService = async (email, password, ipAddress) => {
  const user = await prisma.user.findUnique({
    //[cite: 6]
    where: { email }, //[cite: 6]
  });

  if (!user) {
    //[cite: 6]
    console.warn(
      `[AUTH] Failed login attempt for ${email} from IP: ${ipAddress}`,
    );
    throw new Error("Email atau password salah."); //[cite: 6]
  }

  const isPasswordValid = await bcrypt.compare(password, user.password); //[cite: 6]
  if (!isPasswordValid) {
    //[cite: 6]
    console.warn(
      `[AUTH] Invalid password attempt for ${email} from IP: ${ipAddress}`,
    );
    throw new Error("Email atau password salah."); //[cite: 6]
  }

  const token = jwt.sign(
    //[cite: 6]
    { id: user.id, role: user.role, email: user.email }, //[cite: 6]
    process.env.JWT_SECRET, //[cite: 6]
    { expiresIn: "1d" }, //[cite: 6]
  );

  const { password: _, ...userData } = user; //[cite: 6]
  return { user: userData, token }; //[cite: 6]
};

// --- SERVICE LOGIN KHUSUS ADMIN (KEAMANAN EKSTRA) ---
const loginAdminService = async (email, password, ipAddress, userAgent) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.warn(
      `[SEC-ADMIN] Failed Admin login attempt: Non-existent email (${email}) - IP: ${ipAddress}`,
    );
    throw new Error("Email atau password tidak valid.");
  }

  // VALIDASI KETAT: Tolak jika role bukan ADMIN
  if (user.role !== "ADMIN") {
    console.error(
      `[SEC-CRITICAL] Unauthorized Admin Login Attempt by User ID: ${user.id} (${user.email}) - IP: ${ipAddress}`,
    );
    throw new Error("Akses ditolak. Anda tidak memiliki hak akses Admin.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    console.warn(
      `[SEC-ADMIN] Invalid Password for Admin (${email}) - IP: ${ipAddress}`,
    );
    throw new Error("Email atau password tidak valid.");
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }, // Session Admin dibuat lebih pendek (8 jam)
  );

  console.info(
    `[SEC-ADMIN] Admin Login Success: ${user.email} - IP: ${ipAddress} - Agent: ${userAgent}`,
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
  loginAdminService,
  registerSiswaService,
  updateProfileService,
};
