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

module.exports = {
  loginService,
  registerSiswaService,
};
