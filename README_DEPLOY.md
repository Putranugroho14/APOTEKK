# Panduan Deployment Gratis (TiDB Cloud + Render + Vercel)

Saya telah memperbarui panduan ini agar menggunakan **TiDB Cloud** yang memberikan kapasitas 5GB gratis selamanya.

---

## 🚀 Langkah 1: Push Kode ke GitHub
Buka terminal di VS Code dan jalankan:
```bash
git push origin main
```

---

## 🗄️ Langkah 2: Buat Database Online (TiDB Cloud - Gratis Selamanya)
1. Pergi ke [TiDB Cloud](https://pingcap.com/products/tidb-cloud/) dan daftar/login.
2. Pilih **Create Cluster** -> Pilih **Serverless** (Gratis).
3. Setelah cluster dibuat, klik **Connect**.
4. Pilih **Connect with MySQL Workbench** atau **General** untuk melihat detailnya.
5. Simpan data berikut:
   - **Host** (Contoh: `gateway01.ap-southeast-1.prod.aws.tidbcloud.com`)
   - **User** (Contoh: `xxxxxx.root`)
   - **Password** (Klik ikon mata untuk melihat)
   - **Database** (Default biasanya `test`, Anda bisa buat baru dengan nama `apotek_db`)
   - **Port** (Biasanya `4000`)

---

## ⚙️ Langkah 3: Deploy Backend di Render
1. Pergi ke [Render.com](https://render.com/) dan login menggunakan GitHub.
2. Klik **New** -> **Web Service**.
3. Pilih repository **APOTEKK**.
4. Konfigurasi:
   - **Name:** `apotek-backend`
   - **Root Directory:** `20230140193-server`
   - **Runtime:** `Node`
5. Klik **Advanced** -> **Add Environment Variable**:
   - `DB_HOST` = (Host dari TiDB)
   - `DB_USER` = (User dari TiDB)
   - `DB_PASSWORD` = (Password dari TiDB)
   - `DB_NAME` = (Nama database di TiDB)
   - `DB_PORT` = `4000`
   - `JWT_SECRET` = `KUNCI_RAHASIA_BEBAS`
   - `NODE_ENV` = `production`
6. Klik **Deploy Web Service**. Simpan URL-nya (Contoh: `https://apotek-backend.onrender.com`).

---

## 🎨 Langkah 4: Deploy Frontend di Vercel
1. Pergi ke [Vercel.com](https://vercel.com/) dan login menggunakan GitHub.
2. Klik **Add New** -> **Project**.
3. Pilih repository **APOTEKK**.
4. Konfigurasi:
   - **Root Directory:** Pilih folder `20230140193-react` (Klik Edit).
5. Buka bagian **Environment Variables**, tambahkan:
   - `REACT_APP_API_URL` = (URL Backend dari Render tadi)
6. Klik **Deploy**.

---

## ✅ Selesai!
Website Anda sekarang online. 

**Tips Terakhir:** Seringkali Render (Free Tier) butuh waktu sekitar 1 menit untuk "bangun" saat pertama kali diakses. Jadi jika website terasa lambat di awal, tunggu sebentar saja.
