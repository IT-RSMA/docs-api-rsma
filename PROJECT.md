# 🏛️ PROJECT.md: Rencana Redesain & Otentikasi Terpusat Web Docs API RSMA (Best Version)

> **Status:** Draft / Blueprint Spesifikasi (Belum Diimplementasikan ke Source Code)  
> **Target:** 
> 1. Mengeliminasi elemen UI yang berulang/redundan.
> 2. Mengintegrasikan otentikasi login resmi terpusat ke backend Laravel SIMRS (**Opsi 1: Backend-Verified Auth**), sehingga token tidak bisa dibuat sembarangan oleh publik.
> 3. Merestrukturisasi layout menjadi 3-kolom modern (*Stripe/Scalar standard*).

---

## 🔒 1. Arsitektur Otentikasi Terpusat (Opsi 1: Backend SIMRS)

### Alasan & Latar Belakang Keamanan:
- **Celah Lama:** Dummy credentials di frontend (`admin`/`admin123`) dan form pembuat token publik `POST /api/auth/token` memungkinkan siapa saja mengambil token data rekam medis.
- **Solusi Opsi 1:** Hanya user yang terdaftar resmi di tabel `users` database Laravel SIMRS (misal staf IT RS atau akun resmi instansi Kominfo) yang dapat login dan menerima Bearer Token.

```
┌─────────────────────────┐               ┌────────────────────────────────┐
│   User / Client Kominfo │               │      Backend Laravel SIMRS     │
└────────────┬────────────┘               └───────────────┬────────────────┘
             │                                            │
             │  1. POST /api/login {username, password}   │
             ├───────────────────────────────────────────>│
             │                                            │──┐ 2. Verifikasi Hash
             │                                            │  │    & Cek Role
             │                                            │<─┘
             │  3. Return { status: 200, access_token,    │
             │              user: { name, role, agency } }│
             │<───────────────────────────────────────────┤
             │                                            │
┌────────────┴────────────┐                               │
│ Frontend Docs (Next.js) │                               │
│ - Simpan Token di state │                               │
│ - Unlocked Live Testing │                               │
└────────────┬────────────┘                               │
             │                                            │
             │  4. GET /api/kunjungan-ralan (Bearer Token)│
             ├───────────────────────────────────────────>│
             │                                            │──┐ 5. Validasi Sanctum
             │                                            │  │    & Query SIMRS DB
             │                                            │<─┘
             │  6. Live Response (Data Kunjungan RS)      │
             │<───────────────────────────────────────────┤
```

### Flow Login & Token Lifecycle:
1. **Pengunjung Umum (Guest)**:
   - Dapat melihat seluruh dokumentasi API (Method, URL, Query Parameter, Schema Response).
   - Area konsol pengujian (*Try It Out*) terkunci dengan status: `🔒 Silakan login dengan akun resmi instansi untuk mencoba API`.
2. **Login Resmi**:
   - Form Login mengirim `username` & `password` ke endpoint backend Laravel `POST /api/login`.
   - Backend memvalidasi kredensial dan menerbitkan Sanctum Token spesifik untuk user tersebut.
   - Token disimpan aman di session/localStorage browser.
3. **Logout**:
   - Menghapus token di browser dan mengirim request `POST /api/logout` ke Laravel untuk merevoke token dari database.

---

## 🔍 2. Eliminasi Elemen UI Berulang (Repeating / Redundant)

| Elemen Lama | Masalah Duplikasi | Solusi di "Best Version" |
| :--- | :--- | :--- |
| **Form Generate Token** | Ada di `TokenModal` dan diulang di tengah `MainContent` | **Dihapus total dari UI publik**. Token hanya didapat otomatis setelah user sukses login via endpoint backend. |
| **Display URL Endpoint** | Muncul 3x (Header MainContent, Kotak Kominfo, dan CodePanel) | **Disatukan** menjadi Interactive Endpoint Bar di atas halaman dengan 1-click tombol *"Copy Path"* / *"Copy Full URL"*. |
| **Tampilan Response JSON** | Muncul 2x (Box bawah MainContent dan Panel Kanan) | **Dihapus dari MainContent**. Seluruh respon server (Live Status, Latency ms, & JSON payload) terpusat di panel kanan. |
| **Banner Default Tanggal** | Tampil berulang di tiap halaman | Disederhanakan menjadi callout / badge tooltip yang bersih pada parameter tanggal di tabel. |

---

## 🎨 3. Blueprint Layout "Best Version" (3-Kolom Modern)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  [🏥 RSMA] Docs API SIMRS  |  [🔍 Cari endpoint...]  |  [👤 Login Kominfo / Logout] [☀️/🌙 Tema]   │
├───────────────────┬─────────────────────────────────────────────────┬────────────────────────────────┤
│      SIDEBAR      │                  MAIN CONTENT                   │      INTERACTIVE CONSOLE       │
│                   │               (Murni Dokumentasi)               │     (Playground & Output)      │
│ 📁 Auth           │                                                 │                                │
│   - Login         │ [GET] /api/kunjungan-ralan    [📋 Copy URL]     │ ┌─ Request Snippet ──────────┐ │
│ 📁 Kunjungan      │ ─────────────────────────────────────────────── │ │ curl -X GET "..." -H "..." │ │
│   - Ralan         │ Data Kunjungan Rawat Jalan                      │ └────────────────────────────┘ │
│   - Ranap         │ Mengambil riwayat kunjungan pasien rawat jalan. │                                │
│   - IGD           │                                                 │ ┌─ Try It Out (Kirim Test) ──┐ │
│ 📁 Kasus Penyakit │ 📋 Query Parameters                             │ │ Token: [●●●●● (Terverifikasi)]│
│   - Kanker        │ ┌───────────────┬──────┬─────────┬────────────┐ │ │ Tgl Awal : [2026-09-01]     │ │
│   - Jantung       │ │ Parameter     │ Tipe │ Status  │ Keterangan │ │ │ Tgl Akhir: [2026-09-30]     │ │
│   - Stroke        │ ├───────────────┼──────┼─────────┼────────────┤ │ │                            │ │
│                   │ │ tanggal_awal  │ date │ Opsional│ Default: 5 │ │ │ [ ▶ Kirim Request ]        │ │
│                   │ │ tanggal_akhir │ date │ Opsional│ Default: 4 │ │ └────────────────────────────┘ │
│                   │ └───────────────┴──────┴─────────┴────────────┘ │                                │
│                   │                                                 │ ┌─ Response Server ──────────┐ │
│                   │ 💡 Catatan:                                     │ │ Status: 200 OK  ⚡ 41ms     │ │
│                   │ Periode default adalah tgl 5 bulan berjalan     │ │ [📋 Copas JSON]            │ │
│                   │ hingga tgl 4 bulan berikutnya.                  │ │ {                          │ │
│                   │                                                 │ │   "status": true,          │ │
│                   │                                                 │ │   "data": [ ... ]          │ │
│                   │                                                 │ │ }                          │ │
│                   │                                                 │ └────────────────────────────┘ │
└───────────────────┴─────────────────────────────────────────────────┴────────────────────────────────┘
```

---

## 🛠️ 4. Rencana Perubahan Komponen (Implementation Checklist)

### 1. Backend Laravel (Kebutuhan Endpoint Auth):
- Pastikan backend memiliki route:
  - `POST /api/login` (Menerima username/email + password, mengembalikan `access_token` Sanctum dan data `user`).
  - `POST /api/logout` (Menghapus token aktif dengan `auth()->user()->currentAccessToken()->delete()`).

### 2. Frontend Helper (`app/lib/apiClient.js`):
- Tambahkan fungsi `loginApi(username, password)` yang memanggil endpoint Laravel asli.
- Tambahkan fungsi `logoutApi()` untuk membersihkan token lokal dan memanggil logout backend.
- Hapus helper `generateApiToken` publik yang tidak aman.

### 3. Header & Auth Modal (`Header.jsx` & `LoginModal.jsx`):
- `LoginModal`: Mengganti validasi dummy (`admin/admin123`) dengan `loginApi()` nyata ke backend Laravel.
- `Header`: Menampilkan status instansi yang sedang login (misal: *"Diskominfotik NTB"* / *"Staf IT RS"*), tombol Logout, dan indikator koneksi token.

### 4. Area Tengah (`MainContent.jsx`):
- Hapus form manual token dan form response server.
- Bersihkan duplikasi URL agar MainContent menjadi dokumen yang rapi dan nyaman dibaca.

### 5. Area Kanan (`CodePanel.jsx` ➔ `InteractiveConsole.jsx`):
- Menggabungkan pemilih bahasa (cURL/Fetch), form parameter interaktif, tombol Kirim Request, dan viewer response JSON lengkap dengan latensi (ms) serta HTTP status.

---

> ℹ️ **Konfirmasi**: Dokumen ini siap menjadi panduan saat Anda ingin memulai proses coding/implementasi. Beritahu saya jika Anda ingin mulai mengubah file kode frontend dan backend sesuai rancangan ini!
