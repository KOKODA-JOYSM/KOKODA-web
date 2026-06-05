# Deploy KOKODA ke Azure App Service

Catatan konfigurasi yang **wajib** ada di Azure agar authentication berfungsi
dan tersimpan ke database Azure.

## 1. Startup Command

Azure Portal → App Service → **Configuration → General settings → Startup Command**:

```
/home/site/wwwroot/startup.sh
```

Script [`startup.sh`](startup.sh) menerapkan konfigurasi Nginx dan menjalankan
`php artisan migrate --force` di setiap start, sehingga skema tabel selalu ada di
database Azure.

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
