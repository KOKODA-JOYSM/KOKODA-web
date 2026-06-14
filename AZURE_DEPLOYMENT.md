# Deploy KOKODA ke Azure App Service

Catatan konfigurasi yang **wajib** ada di Azure agar authentication dan fitur
post (CRUD + upload gambar) berfungsi dan tersimpan ke database Azure.

## 1. Startup Command

Azure Portal → App Service → **Configuration → General settings → Startup Command**:

```
/home/site/wwwroot/startup.sh
```

Script [`startup.sh`](startup.sh) berjalan di setiap deploy/restart dan:

1. Menerapkan konfigurasi Nginx custom ([`default`](default)), termasuk
   `client_max_body_size 10M` agar upload gambar post tidak ditolak 413.
2. Menaikkan limit upload PHP (`upload_max_filesize`) via `.user.ini`.
3. Mengarahkan folder upload (`storage/app/public` dan
   `public/images/profile-icons`) ke `/home/storage/...` yang **persistent**,
   karena zip deploy menghapus seluruh `/home/site/wwwroot` setiap deploy.
4. Menjalankan `php artisan storage:link --force` supaya URL gambar post
   (`/storage/posts/...`) bisa diakses publik.
5. Menjalankan `php artisan migrate --force` sehingga skema tabel (users,
   posts, locations, dll) selalu ada di database Azure.
6. Menjalankan `config:cache` + `view:cache` untuk performa production.

Tidak ada Application Setting tambahan yang diperlukan untuk fitur post —
semuanya ditangani `startup.sh`.

## 2. Application Settings (Environment Variables)

Pipeline deploy menjalankan `cp .env.example .env`, dan `.env.example` memakai
`DB_CONNECTION=sqlite`. Nilai di bawah ini harus diisi di **Azure Portal →
Configuration → Application settings** karena environment variable Azure
**meng-override** isi `.env`. Tanpa ini, data auth akan masuk ke file SQLite
ephemeral (hilang saat restart), **bukan** ke MySQL Azure.

| Setting | Nilai | Keterangan |
|---|---|---|
| `APP_ENV` | `production` | Matikan mode debug/OTP statis |
| `APP_DEBUG` | `false` | |
| `APP_KEY` | `base64:...` (generate sekali: `php artisan key:generate --show`) | Artifact GitHub Actions tidak menyertakan `.env`, jadi key harus dari sini. Key yang stabil juga menjaga session tidak ter-invalidate tiap deploy |
| `APP_URL` | `https://<nama-app>.azurewebsites.net` | URL publik (HTTPS) |
| `DB_CONNECTION` | `mysql` | **Override sqlite default** |
| `DB_HOST` | `<server>.mysql.database.azure.com` | Azure Database for MySQL |
| `DB_PORT` | `3306` | |
| `DB_DATABASE` | `kokoda_web` | |
| `DB_USERNAME` | `<user>` | |
| `DB_PASSWORD` | `<password>` | |
| `MYSQL_ATTR_SSL_CA` | `/home/site/wwwroot/DigiCertGlobalRootCA.crt.pem` | Azure MySQL Flexible Server mewajibkan SSL |
| `SESSION_DRIVER` | `database` | Atau `cookie`. Hindari `file` di filesystem ephemeral |
| `MAIL_MAILER` | `resend` (+ kredensial Resend) | Agar email OTP terkirim, bukan ke log |

Setelah mengisi DB di atas, jalankan ulang deploy / restart App Service supaya
`startup.sh` mem-migrate skema ke MySQL Azure.

## 3. Verifikasi

- Registrasi user baru → cek tabel `users` di Azure MySQL bertambah.
- Login/relogin tetap berhasil setelah App Service di-restart (data persisten).

### Fitur Post

- Buat post baru dengan gambar (≤2 MB) → post muncul di `/home` dan gambarnya
  tampil (URL `https://<app>/storage/posts/...` tidak 404).
- Edit post: ganti gambar → gambar lama terhapus, gambar baru tampil.
- Restart App Service **dan** lakukan deploy ulang → gambar post lama tetap
  tampil (file persisten di `/home/storage/app/public`).
- Search (`/search`) dengan filter lokasi → hasil tetap menampilkan gambar.
