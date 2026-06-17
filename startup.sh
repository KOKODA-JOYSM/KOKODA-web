#!/usr/bin/env bash
#
# Startup command untuk Azure App Service (PHP 8 / Nginx).
# Set di Azure Portal:
#   Configuration > General settings > Startup Command:
#     /home/site/wwwroot/startup.sh
#
# Script ini dijalankan setiap kali container start (deploy / restart).

# 1) Terapkan konfigurasi Nginx custom: document root diarahkan ke folder
#    public/ Laravel dan semua request difallback ke index.php.
cp /home/site/wwwroot/default /etc/nginx/sites-available/default
service nginx reload

cd /home/site/wwwroot

# 2) Naikkan limit upload PHP (default 2M) agar gambar post yang lolos
#    validasi Laravel (max:2048 KB) tidak ditolak duluan oleh PHP, dan user
#    yang upload file terlalu besar mendapat pesan validasi yang jelas.
#    Ditulis lewat startup (bukan file commit) karena artifact GitHub Actions
#    tidak menyertakan dotfiles seperti .user.ini.
cat > /home/site/wwwroot/public/.user.ini <<'EOF'
upload_max_filesize = 10M
post_max_size = 12M
EOF

# 3) Simpan upload gambar di folder persistent di luar wwwroot.
#    Zip deploy menghapus seluruh /home/site/wwwroot setiap deploy, sementara
#    /home adalah Azure Files yang persistent. Tanpa ini, semua gambar post
#    dan foto profil yang di-upload user hilang setiap kali deploy.
mkdir -p /home/storage/app/public /home/storage/profile-icons
rm -rf /home/site/wwwroot/storage/app/public
ln -sfn /home/storage/app/public /home/site/wwwroot/storage/app/public
rm -rf /home/site/wwwroot/public/images/profile-icons
ln -sfn /home/storage/profile-icons /home/site/wwwroot/public/images/profile-icons

# 4) Buat symlink public/storage -> storage/app/public supaya URL gambar post
#    (asset('storage/posts/...')) bisa diakses. Symlink ikut terhapus saat
#    deploy, jadi harus dibuat ulang setiap container start.
php artisan storage:link --force

# 5) Jalankan migrasi ke database Azure (MySQL) dengan --force (non-interaktif).
#    Ini memastikan tabel users, sessions, posts, locations, dll tersedia
#    di database Azure, sehingga seluruh registrasi/login dan posting
#    tersimpan ke DB Azure (bukan ke file SQLite ephemeral bawaan repo).
php artisan migrate --force

# 6) Cache config & view untuk performa production. Startup script berjalan
#    ulang setiap deploy/restart, jadi cache selalu segar setelah perubahan
#    Application Settings di portal.
php artisan config:clear
php artisan config:cache
php artisan view:cache

# 7) Start Laravel Reverb WebSocket server sebagai background process.
#    Reverb berjalan di port 6001 internal, di-proxy oleh Nginx (lihat
#    file `default`) ke path /app untuk koneksi WebSocket client.
#    Tanpa ini, fitur chat realtime tidak berfungsi di Azure.
php artisan reverb:start --host=0.0.0.0 --port=6001 &

# 8) Start queue worker untuk memproses broadcast events.
#    Events seperti MessageSent, ConversationUpdated akan di-dispatch
#    ke queue dan perlu worker untuk memprosesnya.
php artisan queue:work --tries=3 --timeout=60 --sleep=3 &

