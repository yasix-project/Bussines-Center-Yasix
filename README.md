# 🛒 Business Center SMK Yadika 6 — Backend API Services

Aplikasi backend RESTful API untuk memodernisasi operasional unit usaha & koperasi SMK Yadika 6 (Business Center), mencakup transaksi Point of Sale (POS), Manajemen Inventaris ATK dengan Kalkulator Margin, Layanan Jasa Cetak/Print Mandiri berbasis PDF, Audit Shift Kasir, serta Dashboard Analytics Laporan Keuangan.

Sistem ini dikembangkan khusus untuk mendukung partisipasi dalam **Garda Tech National Innovation Competition (GTNIC) 2026** pada subtema _Accelerating Digital Transformation for Business and SMEs_.

---

## 🛠️ Tech Stack & Library

- **Runtime & Framework:** Node.js (v24+) & Express.js (v5)
- **Database & ORM:** MySQL 8.0 & Prisma ORM (v5.22)
- **Containerization:** Docker & Docker Compose
- **Authentication & Security:** JSON Web Token (JWT), Bcrypt, Helmet, CORS, Express Rate Limit
- **File Processing & Upload:** Multer & `pdf-lib` (Automatic PDF Page Counter)
- **Development & Tooling:** Nodemon, Morgan, Dotenv

---

## 🏗️ Arsitektur System & Folder Structure

Menggunakan pendekatan **Clean Modular Architecture** dengan pemisahan peran yang tegas antara _Routes_, _Controllers_, _Services (Business Logic)_, dan _Middlewares_:

```text
backend/
├── prisma/
│   ├── schema.prisma         # Skema database MySQL & Relasi Prisma ORM
│   └── seed.js               # Script pengisian data awal (Admin, Kasir, Siswa, Kategori)
├── src/
│   ├── config/
│   │   └── prisma.js         # Singleton instance Prisma Client
│   ├── controllers/          # Handler HTTP Request & Response JSON
│   ├── middlewares/          # JWT Verification, Role Guard, File Upload
│   ├── routes/               # Mounting Endpoint API Modular
│   ├── services/             # Business Logic & Atomic DB Transactions ($transaction)
│   └── index.js              # Server Entry Point Express.js
├── uploads/                  # Direktori penyimpanan berkas PDF jasa print
├── .env                      # File konfigurasi Environment Variables
├── docker-compose.yml        # Orchestration Container MySQL
└── package.json
```

---

## 🔌 API Endpoints Summary

API v1 diakses melalui _prefix_ `/api/v1`. Seluruh rute terproteksi membutuhkan header:  
`Authorization: Bearer <JWT_TOKEN>`

| Modul            | Method   | Endpoint                        | Access Role   | Deskripsi Fitur                                        |
| :--------------- | :------- | :------------------------------ | :------------ | :----------------------------------------------------- |
| **Health Check** | `GET`    | `/api/v1/health`                | Public        | Pengecekan status server & koneksi MySQL Docker        |
| **Auth**         | `POST`   | `/api/v1/auth/login`            | Public        | Autentikasi pengguna & pengeluaran JWT Token           |
|                  | `POST`   | `/api/v1/auth/register-siswa`   | Admin         | Pendaftaran akun siswa & auto-generate QR Member       |
|                  | `GET`    | `/api/v1/auth/me`               | Authenticated | Mengambil profil user aktif                            |
| **Products**     | `GET`    | `/api/v1/products`              | Authenticated | Katalog barang ATK (Filter & Search)                   |
|                  | `GET`    | `/api/v1/products/low-stock`    | Admin, Kasir  | Alert barang dengan stok $\le$ minStock                |
|                  | `POST`   | `/api/v1/products`              | Admin         | Tambah produk + **Kalkulator Margin Otomatis**         |
|                  | `PUT`    | `/api/v1/products/:id`          | Admin         | Edit HPP, margin, stok, & detail produk                |
|                  | `DELETE` | `/api/v1/products/:id`          | Admin         | Hapus produk dari sistem                               |
| **Categories**   | `GET`    | `/api/v1/categories`            | Authenticated | Mengambil daftar kategori (ATK / PRINT)                |
|                  | `POST`   | `/api/v1/categories`            | Admin         | Tambah kategori baru                                   |
| **Jasa Print**   | `POST`   | `/api/v1/print/estimate`        | Authenticated | Upload PDF sementara & hitung jumlah halaman           |
|                  | `POST`   | `/api/v1/print/order`           | Authenticated | Pemesanan jasa cetak & hitung estimasi biaya           |
|                  | `GET`    | `/api/v1/print/orders`          | Admin, Kasir  | Pemantauan antrean cetak (_Print Queue_)               |
| **Transactions** | `POST`   | `/api/v1/transactions/checkout` | Admin, Kasir  | **Atomic Checkout POS** (Potong stok & kalkulasi poin) |
|                  | `GET`    | `/api/v1/transactions`          | Admin, Kasir  | Riwayat seluruh transaksi                              |
|                  | `GET`    | `/api/v1/transactions/:id`      | Admin, Kasir  | Detail transaksi spesifik untuk E-Receipt/Struk        |
| **Shifts**       | `POST`   | `/api/v1/shifts/start`          | Admin, Kasir  | Buka shift kasir & pencatatan kas awal                 |
|                  | `GET`    | `/api/v1/shifts/active`         | Admin, Kasir  | Cek status shift aktif & estimasi penerimaan kas       |
|                  | `POST`   | `/api/v1/shifts/end`            | Admin, Kasir  | Tutup shift & kalkulasi otomatis selisih kas           |
|                  | `GET`    | `/api/v1/shifts`                | Admin, Kasir  | Riwayat rekapitulasi shift kasir                       |
| **Vouchers**     | `POST`   | `/api/v1/vouchers/validate`     | Authenticated | Validasi kode promo diskon belanja                     |
|                  | `POST`   | `/api/v1/vouchers`              | Admin         | Pembuatan kode promo voucher baru                      |
| **Analytics**    | `GET`    | `/api/v1/analytics/dashboard`   | Admin         | Ringkasan Omset Hari Ini, Laba Bersih, & Stat          |
|                  | `GET`    | `/api/v1/analytics/sales`       | Admin         | Laporan Rekapitulasi Penjualan (Filter Tanggal)        |

---

## 🚀 Panduan Memulai (Local Setup)

### 1. Prerequisites

- [Node.js v24+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 2. Konfigurasi Environment (`.env`)

Buat file `.env` di dalam folder `backend/`:

```env
DATABASE_URL=""
PORT=
JWT_SECRET=""
```

### 3. Jalankan Database MySQL via Docker

```bash
docker compose up -d
```

### 4. Eksekusi Migrasi & Data Seed

```bash
# 1. Migrasi database
npx prisma migrate dev --name init

# 2. Generasi Prisma Client
npx prisma generate

# 3. Jalankan seeding data awal (Admin, Kasir, Siswa, & Kategori)
npx prisma db seed
```

### 5. Jalankan Server Backend

```bash
npm run dev
```

Server backend akan berjalan di: `http://localhost:5000`

---
