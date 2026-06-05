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

# 2) Jalankan migrasi ke database Azure (MySQL) dengan --force (non-interaktif).
#    Ini memastikan tabel users, sessions, password_reset_tokens, dll tersedia
#    di database Azure, sehingga seluruh registrasi/login tersimpan ke DB Azure
#    (bukan ke file SQLite ephemeral bawaan repo).
php artisan migrate --force
