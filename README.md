# Soutenance Amin Fehri

Premium soutenance invitation website for Amin Fehri - ISAMS Sfax.

This project is a mobile-first, elegant, and responsive digital invitation built with Vite, React, and TypeScript.
It includes a shared memories gallery where guests can upload photos to Cloudinary, while metadata is stored in Supabase so everyone sees the same gallery.

## 1. Project Description

Premium soutenance invitation website for Amin Fehri - ISAMS Sfax.

## 2. Features

- Responsive website (mobile-first)
- Mobile bottom navigation
- Hero section
- Event details
- Shared memories gallery
- Cloudinary upload
- Supabase database
- Realtime gallery updates
- Web Share API
- Visitor gate with localStorage name
- Uploader name on each souvenir
- Photo lightbox preview

## 3. Install Commands

```bash
npm install
npm run dev
npm run build
```

## 4. Environment Variables

Create a `.env.local` file in the project root and add:

```env
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_MEMORY_ADMIN_CODE=
```

Notes:

- Never hardcode real keys in source code.
- Frontend code reads values using `import.meta.env`.

## 5. Cloudinary Setup

1. Create a free Cloudinary account.
2. Open Cloudinary Dashboard > Settings.
3. Create an unsigned upload preset.
4. Set the upload folder to match `MEMORY_FOLDER` in `src/services/cloudinaryService.ts` if needed.
5. Copy your Cloud name.
6. Put Cloud name and unsigned preset in `.env.local`.

## 6. Supabase Setup

1. Create a free Supabase project.
2. Open SQL Editor.
3. Paste the memories SQL from [`src/services/supabaseSchema.ts`](src/services/supabaseSchema.ts).
4. Run the SQL so table + RLS policies are created.
5. Run this migration to store uploader name:

```sql
alter table memories
add column if not exists uploader_name text;
```

6. Copy project URL and anon key.
7. Put them in `.env.local`.
8. Enable realtime for `memories` table if desired.

Realtime note:

- Realtime updates require Supabase Realtime/replication enabled for the `memories` table.
- If realtime is unavailable, manual refresh in the UI still works.

Visitor note:

- Visitor names are stored in browser `localStorage` using key `soutenance_visitor_name`.
- New uploads are saved in Supabase with `uploader_name`.
- Older memories created before this migration may display uploader as `invité`.

## 7. Vercel Deployment

```bash
npm install -g vercel
vercel
vercel --prod
```

## 8. Vercel Environment Variables

`.env.local` does not get uploaded automatically to Vercel.
You must add the same variables manually in:

`Vercel Dashboard > Project > Settings > Environment Variables`

Add all required variables:

- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_MEMORY_ADMIN_CODE`

## 9. Important Security Note

- Cloudinary unsigned upload is okay for demo usage, but it can be abused if exposed publicly.
- Supabase public insert/delete policies are acceptable for this soutenance demo, but not for production-grade apps.
- Real secure delete from Cloudinary needs a backend, because Cloudinary API secret must never be exposed in frontend code.

## 10. How To Change Event Information

Update content in these files:

- [`src/components/HeroSection.tsx`](src/components/HeroSection.tsx): institution, main title, student name, event label, hero message.
- [`src/components/DetailsSection.tsx`](src/components/DetailsSection.tsx): date, time, location cards.
- [`src/pages/SouvenirsPage.tsx`](src/pages/SouvenirsPage.tsx): invitation message inside the Souvenirs page.
- [`src/App.tsx`](src/App.tsx): section order and navigation labels.

## 11. How To Change Colors

Main theme colors are defined in:

- [`src/index.css`](src/index.css) under `@theme`

Edit these variables:

- `--color-navy-900`
- `--color-navy-800`
- `--color-mist-50`
- `--color-mist-100`
- `--color-gold-500`
- `--color-gold-600`

You can also tweak section gradients/shadows directly in component class names for a different premium look.

## 12. How To Replace Images

This project uses two image sources:

- Static public assets (favicon/icons) in `public/`
- Dynamic memory media uploaded by users to Cloudinary

To replace static visuals:

1. Put your files in `public/`.
2. Reference them in components with paths like `/your-image.jpg`.
3. Update any section/page component (`HeroSection`, `SouvenirsPage`, etc.) where you want new visuals.
4. To update the profile badge image, replace `src/assets/soutenance-profile.png`.

For gallery media, users upload directly from the Memory section. Those files are stored in Cloudinary and rendered from `secure_url`.
