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

### Fitur Chat (Realtime)

- Buka `/chat` di dua browser berbeda (login sebagai 2 user berbeda).
- Mulai conversation baru dari salah satu user → conversation muncul di kedua sisi.
- Kirim pesan dari satu user → pesan muncul **realtime** di window lainnya tanpa refresh.
- Typing indicator → muncul saat user mengetik di sisi lawan bicara.
- Online status → indicator hijau muncul untuk user yang online.
- Refresh halaman → semua conversations dan messages tetap tersimpan.
- Periksa console browser: WebSocket connection ke `wss://<app>.azurewebsites.net/app/...`
  harus **connected** (bukan error 502/503).

### Fitur Comment (Realtime)

Fitur comment memakai **infrastruktur Reverb yang sama** dengan chat, jadi tidak
ada Application Setting tambahan yang perlu diisi — selama bagian Chat/Reverb di
bawah sudah dikonfigurasi (`BROADCAST_CONNECTION=reverb`, Web sockets `On`,
queue worker jalan via `startup.sh`), comment otomatis realtime. Comment
disiarkan lewat **public channel** `post.{id}`, jadi tidak butuh auth channel.

- Buka satu post yang sama di dua browser berbeda → klik ikon comment.
- Kirim comment dari satu user → comment muncul **realtime** di window lain
  tanpa refresh.
- Hapus comment milik sendiri (atau comment di post milikmu sebagai pemilik
  post) → comment hilang **realtime** di kedua sisi.
- Refresh halaman → semua comment tetap tersimpan (tersimpan di tabel
  `comments` di MySQL Azure).

## 4. Chat / Reverb (WebSocket)

### Prasyarat

> **App Service Plan harus B1 atau lebih tinggi** — Free (F1) dan Shared (D1) tidak
> mendukung WebSocket dan "Always On" yang dibutuhkan Reverb.

- Azure Portal → App Service → **Configuration → General settings**:
  - **Web sockets**: `On`
  - **Always On**: `On`

### Application Settings tambahan untuk Chat

| Setting | Nilai | Keterangan |
|---|---|---|
| `BROADCAST_CONNECTION` | `reverb` | Aktifkan broadcasting via Reverb |
| `REVERB_APP_ID` | `kokoda-chat` | ID aplikasi Reverb |
| `REVERB_APP_KEY` | `<random-string>` | Key untuk client authentication |
| `REVERB_APP_SECRET` | `<random-string>` | Secret untuk server authentication |
| `REVERB_HOST` | `127.0.0.1` | Target publish **server->Reverb** (lokal). Bukan `0.0.0.0`/`localhost:8080`. |
| `REVERB_PORT` | `6001` | Port Reverb internal (sama dengan `reverb:start`, di-proxy Nginx) |
| `REVERB_SCHEME` | `http` | Reverb di 6001 berbicara HTTP polos. **Jangan `https`** — TLS ke port non-TLS = publish gagal. |
| `VITE_REVERB_APP_KEY` | (sama dengan `REVERB_APP_KEY`) | Frontend key |
| `VITE_REVERB_HOST` | `<app>.azurewebsites.net` | Frontend WebSocket host |
| `VITE_REVERB_PORT` | `443` | Frontend port (wss via Nginx) |
| `VITE_REVERB_SCHEME` | `https` | Frontend scheme |

> **Penting — server-side vs frontend:** `REVERB_HOST/PORT/SCHEME` mengatur jalur
> **publish PHP -> Reverb** (harus `127.0.0.1:6001` HTTP). `VITE_REVERB_*` mengatur
> koneksi **browser -> Reverb** (selalu `wss`/443 via Nginx). Keduanya berbeda dan
> tidak boleh disamakan.
>
> **Sudah di-hardcode:** `startup.sh` (langkah 1b) meng-`export` `REVERB_HOST=127.0.0.1`,
> `REVERB_PORT=6001`, `REVERB_SCHEME=http`, `BROADCAST_CONNECTION=reverb` sebelum
> `config:cache`, jadi nilai server-side yang benar selalu dipakai walau Application
> Setting di portal salah/kosong. Comment realtime tidak lagi bergantung pada portal.

> **Catatan**: `VITE_*` variables harus di-set saat **build time** (bukan runtime)
> karena Vite me-replace variabel ini saat bundling. Jika menggunakan GitHub Actions
> untuk build, set `VITE_*` sebagai environment variables di workflow file.

### Cara kerja di Azure

1. `startup.sh` menjalankan `php artisan reverb:start --host=0.0.0.0 --port=6001 &`
   sebagai background process.
2. Nginx (konfigurasi `default`) mem-proxy WebSocket connections dari path `/app`
   ke `127.0.0.1:6001`.
3. Client (browser) connect ke `wss://<app>.azurewebsites.net/app/<key>` via
   Laravel Echo.
4. Queue worker (`php artisan queue:work &`) memproses broadcast events.

## 5. Stale route/config cache (penyebab route 404 di prod, padahal jalan di lokal)

**Gejala:** sebuah route yang ada di `routes/web.php` dan berfungsi di lokal malah
balas `404` di Azure (contoh nyata: `/profile/{user}` dari leaderboard). `Route::fallback()`
juga tidak jalan.

**Penyebab:** kalau `bootstrap/cache/routes-v7.php` (atau `config.php`) pernah ter-generate
di server, Laravel **hanya** membaca file cache itu dan mengabaikan `routes/web.php`
sepenuhnya. Azure zip-deploy menumpuk file ke disk `/home` yang persistent (bukan
menghapusnya), jadi cache lama bisa bertahan berminggu-minggu dan menyembunyikan
semua route yang ditambahkan setelah cache dibuat.

**Perbaikan cepat (manual):** hapus file cache-nya, lalu Laravel kembali baca route live:

```bash
TOKEN=$(az account get-access-token --resource https://management.core.windows.net/ --query accessToken -o tsv)
SCM="https://kokoda-dyg6f8dhgghbang2.scm.southeastasia-01.azurewebsites.net"
curl -X DELETE -H "Authorization: Bearer $TOKEN" -H "If-Match: *" \
  "$SCM/api/vfs/site/wwwroot/bootstrap/cache/routes-v7.php"
```

**Pencegahan:** workflow deploy (`.github/workflows/main_kokoda.yml`) sudah punya step
**"Clear stale Laravel route/config cache on App Service"** yang menghapus
`routes-v7.php` + `config.php` lewat Kudu VFS setiap selesai deploy.

