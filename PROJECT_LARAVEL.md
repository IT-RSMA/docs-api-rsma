# 🚀 PROJECT_LARAVEL.md: Panduan Implementasi Otomatis Auth SIMRS API

> **Tujuan Dokumen**: Berisi kode siap pakai (copy-paste / generator otomatis) untuk backend Laravel SIMRS agar langsung mendukung endpoint otentikasi login resmi (`/login` & `/logout`) dengan Laravel Sanctum.

---

## ⚡ 1. Command Artisan yang Perlu Dijalankan (Cukup 1x)

Buka terminal di direktori project Laravel Anda, lalu jalankan:

```bash
# 1. Pastikan tabel users dan personal_access_tokens dibuat
php artisan migrate

# 2. Buat controller khusus autentikasi API
php artisan make:controller Api/AuthController
```

---

## 📂 2. File Controller: `app/Http/Controllers/Api/AuthController.php`

Gantikan isi file `app/Http/Controllers/Api/AuthController.php` dengan kode berikut:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * POST /api/login
     * Otentikasi Staf / Akun Instansi (Kominfo) & Terbitkan Sanctum Bearer Token
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|string', // Menerima email atau username
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => false,
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors(),
            ], 422);
        }

        // Cari user berdasarkan email atau nama
        $user = User::where('email', $request->email)
                    ->orWhere('name', $request->email)
                    ->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'status'  => false,
                'message' => 'Email/Username atau Password tidak cocok!',
            ], 401);
        }

        // Opsional: Batasi token aktif agar tidak menumpuk (hapus token lama jika diinginkan)
        // $user->tokens()->where('name', 'web-docs-token')->delete();

        // Buat Token Sanctum Baru
        $token = $user->createToken('web-docs-token')->plainTextToken;

        return response()->json([
            'status'  => true,
            'message' => 'Login berhasil',
            'data'    => [
                'access_token' => $token,
                'token_type'   => 'Bearer',
                'user'         => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                ],
            ],
        ], 200);
    }

    /**
     * POST /api/logout
     * Revoke / Hapus Bearer Token yang Sedang Aktif
     */
    public function logout(Request $request)
    {
        if ($request->user()) {
            // Hapus token yang sedang digunakan saat ini
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'status'  => true,
            'message' => 'Logout berhasil. Token telah dicabut.',
        ], 200);
    }

    /**
     * GET /api/user-profile
     * Mengecek identitas token yang sedang aktif
     */
    public function me(Request $request)
    {
        return response()->json([
            'status' => true,
            'data'   => $request->user(),
        ]);
    }
}
```

---

## 🛣️ 3. Daftarkan Rute di `routes/api.php`

Tambahkan baris rute berikut ke dalam file `routes/api.php` di project Laravel Anda:

```php
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| Autentikasi API SIMRS (Docs Web Portal)
|--------------------------------------------------------------------------
*/

// Endpoint Publik: Login untuk verifikasi & perolehan token
Route::post('/login', [AuthController::class, 'login']);

// Endpoint Terproteksi: Logout & Cek User Aktif
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});
```

---

## 👤 4. Seeder Otomatis untuk Akun Instansi (Kominfo / Staf RS)

Agar Anda tidak perlu input manual tiap kali migrasi, buat seeder otomatis:

```bash
php artisan make:seeder ApiUserSeeder
```

Lalu isi file `database/seeders/ApiUserSeeder.php`:

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ApiUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Akun Resmi Instansi Luar (Kominfo)
        User::updateOrCreate(
            ['email' => 'kominfo@sumbawakab.go.id'],
            [
                'name'     => 'Diskominfotik Sumbawa',
                'password' => Hash::make('PasswordKominfo2026!'), // Ganti password sesuai kebutuhan
            ]
        );

        // 2. Akun Staf IT Internal RSMA
        User::updateOrCreate(
            ['email' => 'it.rsma@sumbawakab.go.id'],
            [
                'name'     => 'IT RSUD Manambai',
                'password' => Hash::make('AdminRSMA2026!'),
            ]
        );
    }
}
```

Jalankan Seeder dengan:
```bash
php artisan db:seed --class=ApiUserSeeder
```

---

## 🛡️ 5. Pastikan CORS Diizinkan di Laravel (Penting!)

Agar Next.js (`http://localhost:3000`) bisa berkomunikasi ke Laravel (`http://127.0.0.1:8000`), buka file `config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],

'allowed_methods' => ['*'],

'allowed_origins' => [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    // Masukkan domain web docs jika sudah di-hosting
],

'allowed_headers' => ['*'],

'supports_credentials' => true,
```

---

## ✅ 6. Kredensial Login Siap Pakai di Web Docs:

Setelah menjalankan langkah di atas, Anda bisa langsung mencoba login di Web Docs Next.js:

| Role / Akun | Username / Email | Password |
| :--- | :--- | :--- |
| **Instansi Luar** | `kominfo@sumbawakab.go.id` | `PasswordKominfo2026!` |
| **Internal IT RS** | `it.rsma@sumbawakab.go.id` | `AdminRSMA2026!` |

> Begitu login berhasil, token otomatis tersimpan dan tombol **"Kirim Request ke Endpoint"** langsung aktif di web docs!
