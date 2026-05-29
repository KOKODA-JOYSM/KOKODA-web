# Setup & Installation Guide - KOKODA Main Page Feature

Kami telah membuat fitur mainpage untuk KOKODA yang memungkinkan users untuk membuat, melihat, mengedit, dan menghapus postingan barang hilang atau ditemukan.

## Fitur yang Ditambahkan

### 1. **Database Models & Migrations**
- **Model**: `App\Models\Post` - Model untuk postingan barang hilang/ditemukan
- **Migration**: `0001_01_01_000003_create_posts_table.php` - Tabel untuk menyimpan data posts
- **Seeder**: `PostSeeder` - Data sample untuk testing

### 2. **Controller**
- **PostController** - Menangani semua logika CRUD untuk posts

### 3. **Authorization**
- **PostPolicy** - Mengecek apakah user bisa edit/delete post mereka sendiri
- **AuthServiceProvider** - Mendaftarkan policy

### 4. **Frontend Components**

#### Pages:
- `Home.jsx` - Mainpage menampilkan semua posts dengan filter & search
- `Posts/Create.jsx` - Halaman membuat post baru
- `Posts/Show.jsx` - Menampilkan detail post
- `Posts/Edit.jsx` - Halaman edit post

#### Components:
- `PostCard.jsx` - Komponen untuk menampilkan preview post

### 5. **Routes**
- `GET /home` - Mainpage (untuk semua user)
- `GET /posts/create` - Form membuat post (hanya authenticated users)
- `POST /posts` - Store post baru (hanya authenticated users)
- `GET /posts/{post}` - Lihat detail post (untuk semua user)
- `GET /posts/{post}/edit` - Form edit post (hanya pemilik post)
- `PATCH /posts/{post}` - Update post (hanya pemilik post)
- `DELETE /posts/{post}` - Delete post (hanya pemilik post)

## Langkah Setup

### 1. Run Database Migrations
```bash
php artisan migrate
```

### 2. Seed Database dengan Data Sample
```bash
php artisan db:seed
```
Atau hanya PostSeeder:
```bash
php artisan db:seed --class=PostSeeder
```

### 3. Setup Storage Symlink (untuk image uploads)
```bash
php artisan storage:link
```

### 4. Start Development Server
```bash
php artisan serve
```

## Struktur Warna & Style

Semua styling menggunakan design tokens dari `tailwind.config.js`:

- **Primary**: #F4C799 (Warm tan/beige)
- **Secondary**: #C0976C (Brownish)
- **Highlight**: #FFE7A3 (Light yellow)
- **Label Found**: #5D8CAD (Blue)
- **Label Lost**: #D56666 (Red)
- **Base**: #FEFEFE (Off-white)
- **Tertiary**: #311A05 (Dark brown - untuk text)

Font: Quicksand (menu dan headers), Roboto

## Tampilan Features

### Mainpage Features:
✅ Grid layout untuk posts
✅ Filter by type (All, Lost, Found)
✅ Search functionality
✅ Responsive design dengan mobile support
✅ Button untuk create post

### Post Card menampilkan:
✅ Image preview
✅ Lost/Found badge dengan warna berbeda
✅ Username & lokasi
✅ Title & description
✅ Category badge
✅ CTA button (Lost Item / Found Item)

### Create Post Form:
✅ Item type selection (Lost/Found)
✅ Title, category, location, description
✅ Image upload dengan preview
✅ Form validation

### Post Detail Page:
✅ Full image display
✅ User info & post metadata
✅ Status indicator
✅ Edit & Delete buttons (hanya untuk pemilik post)

## Database Schema

### Posts Table:
```sql
- id (Primary Key)
- user_id (Foreign Key ke users table)
- title (string)
- description (text)
- image_url (string, nullable)
- location (string)
- type (enum: 'lost', 'found')
- category (string, nullable)
- status (enum: 'active', 'resolved')
- created_at (timestamp)
- updated_at (timestamp)
```

## Sample Data

Seeder sudah membuat beberapa sample posts:
1. Menemukan Dompet Skena - Sentul, Bogor
2. DICARI! Kucing Kampung - Bengkalis, Riau
3. Menemukan Sepatu - Butam, Kepri
4. HILANG! iPhone 14 Pro - Sentul, Bogor
5. Ditemukan Kunci - Riau
6. HILANG! Jam Tangan Fossil - Kepri

## Testing

### URLs untuk Testing:
- **Mainpage**: http://localhost:8000/home
- **Create Post**: http://localhost:8000/posts/create (harus login dulu)
- **Post Detail**: http://localhost:8000/posts/1
- **Edit Post**: http://localhost:8000/posts/1/edit

### Test Account:
Email: test@example.com
Password: password

Atau buat akun baru via auth feature yang sudah dibuat temanmu.

## Notes & Tips

1. **Image Storage**: Images disimpan di `storage/app/public/posts/`
2. **Mobile Responsive**: Navbar otomatis berubah ke hamburger menu di mobile
3. **Authorization**: Hanya pemilik post bisa edit/delete postnya
4. **Search**: Case-insensitive, bisa search title, description, atau location
5. **Pagination**: Mainpage menampilkan 10 posts per page

## File Structure

```
app/
  ├── Http/
  │   └── Controllers/
  │       └── PostController.php (NEW)
  ├── Models/
  │   └── Post.php (NEW)
  ├── Policies/
  │   └── PostPolicy.php (NEW)
  └── Providers/
      └── AuthServiceProvider.php (NEW)

database/
  ├── migrations/
  │   └── 0001_01_01_000003_create_posts_table.php (NEW)
  └── seeders/
      ├── DatabaseSeeder.php (UPDATED)
      └── PostSeeder.php (NEW)

resources/
  └── js/
      ├── Components/
      │   └── PostCard.jsx (NEW)
      └── Pages/
          ├── Home.jsx (NEW)
          └── Posts/ (NEW DIR)
              ├── Create.jsx
              ├── Show.jsx
              └── Edit.jsx

routes/
  └── web.php (UPDATED - ditambah post routes)
```

## Troubleshooting

### Error "Class 'App\Models\Post' not found"
- Pastikan sudah run `php artisan migrate`
- Pastikan file `app/Models/Post.php` ada

### Images tidak bisa diakses
- Pastikan sudah run `php artisan storage:link`
- Periksa `storage/app/public/posts/` folder

### Login diperlukan untuk create post
- Ini benar! User harus login untuk membuat post
- Feature auth sudah dibuat temanmu, gunakan itu untuk login

### Warna tidak sesuai
- Semua warna sudah sesuai dengan `tailwind.config.js`
- Pastikan TailwindCSS sudah compiled dengan `npm run build` atau `npm run dev`
