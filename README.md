# 🏥 Doc-Api RSMA — Portal Dokumentasi & Testing API

Portal Dokumentasi & Testing API Resmi **RS H.L Manambai AbdulKadir**. Aplikasi web modern dan interaktif yang dibangun menggunakan **Next.js 16 (App Router)**, **React 19**, dan **TailwindCSS v4** untuk mempermudah integrasi data antar instansi/dinas secara aman dan terstandar.

![Doc-Api RSMA Logo](public/logo-rsma.png)

---

## ✨ Fitur Utama

- ⚡ **Testing API (Try It Out)**: Uji coba endpoint API secara *live* langsung ke backend SIMRS.
- 💻 **Generator Kode Multi-Bahasa**: Contoh request otomatis untuk **cURL**, **JavaScript (Fetch)**, **PHP (cURL)**, dan **Python (Requests)**.
- 📐 **Panel Response Interaktif & Resizable**: Panel samping yang dapat digeser (drag & resize) untuk fleksibilitas membaca *Live Server Response* dan *Schema JSON*.
- 🔑 **Autentikasi JWT Bearer Token**: Integrasi simulasi login instansi/dinas untuk mendapatkan JWT Access Token dan menguji endpoint terlindungi.
- 🌙 **Mode Terang & Gelap (Dark/Light Mode)**: Desain UI modern dengan toggle animasi custom yang nyaman di mata.
- 🔍 **Pencarian Endpoint Cepat**: Fitur filter pencarian endpoint secara real-time berdasarkan judul, path, atau kata kunci (misal: `ranap`, `kanker`).

---

## 🛠️ Spesifikasi Endpoint API

Dokumentasi ini mencakup 5 kategori utama endpoint:

1. **Autentikasi & Keamanan**
   - `POST /api/auth/token` — Mendapatkan Bearer JWT Token dengan Client ID & Secret Key.
   - `GET /api/kunjungan-ralan` — Aturan IP Whitelist & Header Bearer Token.

2. **Kunjungan Rawat Jalan (Ralan)**
   - `GET /api/kunjungan-ralan` — Total Kunjungan Rawat Jalan.
   - `GET /api/kunjungan-ralan/per-pj` — Kunjungan Ralan per Jenis Pembayaran (BPJS, Umum, dll).

3. **Kunjungan Rawat Inap (Ranap)**
   - `GET /api/kunjungan-ranap` — Total Kunjungan Rawat Inap.
   - `GET /api/kunjungan-ranap/per-pj` — Kunjungan Ranap per Jenis Pembayaran.

4. **Kunjungan IGD**
   - `GET /api/kunjungan-igd` — Total Kunjungan Pasien IGD.
   - `GET /api/kunjungan-igd/per-pj` — Kunjungan IGD per Jenis Pembayaran.

5. **Statistik Penyakit**
   - `GET /api/penyakit-ralan/top10-ralan` — Top 10 Penyakit Rawat Jalan.
   - `GET /api/penyakit-ranap/top10-ranap` — Top 10 Penyakit Rawat Inap.
   - `GET /api/penyakit/kanker` — Kasus Kanker (Neoplasma Ganas ICD C00–C97).
   - `GET /api/penyakit/jantung` — Kasus Jantung & Pembuluh Darah (ICD I20–I52).
   - `GET /api/penyakit/stroke` — Kasus Stroke Serebrovaskular (ICD I60–I69).
   - `GET /api/penyakit/uronefro` — Kasus Ginjal & Saluran Kemih (ICD N00–N39).

---

## 🚀 Panduan Memulai (Getting Started)

### Prasyarat
- Node.js versi `18.x` atau lebih baru
- npm, pnpm, atau yarn

### 1. Kloning Repositori
```bash
git clone https://github.com/username/doc-api-rsma.git
cd doc-api-rsma
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Jalankan Dev Server
```bash
npm run dev
```
Buka browser dan akses `http://localhost:3000`.

### 4. Build untuk Produksi
```bash
npm run build
npm run start
```

---

## 🗂️ Struktur Direktori

```text
api-docs/
├── app/
│   ├── components/
│   │   ├── Header.jsx         # Header & Logo RSMA, Search Bar, Theme Toggle, Login Button
│   │   ├── Sidebar.jsx        # Navigasi Kategori & Endpoint API
│   │   ├── MainContent.jsx    # Informasi Endpoint & Panel Testing API
│   │   ├── CodePanel.jsx      # Panel Tab Bahasa Kode & Live Response JSON
│   │   └── LoginModal.jsx     # Modal Login User / Instansi API
│   ├── data/
│   │   └── apiData.js         # Master Data Skema & Mock Response Endpoint
│   ├── lib/
│   │   └── apiClient.js       # Client API Handler (Fetch API RS SIMRS)
│   ├── globals.css            # Styling Utama, Design System & Tailwind CSS
│   ├── layout.js              # Root Layout & Metadata Application
│   └── page.jsx               # Halaman Utama (Main State Handler)
├── public/
│   └── logo-rsma.png          # Logo Resmi RS H.L Manambai AbdulKadir
├── package.json
└── README.md
```

---

## 🔒 Kebijakan Keamanan & Otorisasi

Seluruh endpoint penarikan data API RS H.L Manambai AbdulKadir menggunakan standar HTTP Header:
```http
Authorization: Bearer <access_token>
```
Selain token JWT yang sah, server SIMRS memverifikasi IP pengirim terhadap **IP Whitelist** instansi/dinas yang terdaftar di Tim IT RS.

---

## 📝 Lisensi

Hak Cipta © 2026 **Tim IT RS H.L Manambai AbdulKadir**. Seluruh hak cipta dilindungi undang-undang.
