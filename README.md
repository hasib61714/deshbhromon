# 🇧🇩 দেশভ্রমণ — DeshBhromon

বাংলাদেশকে নতুন করে আবিষ্কার করুন। DeshBhromon is a Bangla-first Bangladesh travel companion:

- **ভ্রমণ ম্যাপ** — mark visited / wishlist districts on an interactive 64-district map and export it as PNG, JPG or PDF
- **৬৪ জেলার গাইড** — places, how to get there, costs, food and photos (with Wikimedia Commons credits)
- **ট্রিপ প্ল্যানার**, **ট্রাভেল ডায়েরি**, **খাবারের তালিকা**, **বিশ্ব ভ্রমণ ট্র্যাকার**
- **নিরাপত্তা ও ঋতু গাইড**, **জরুরি সেবা**, **কুইজ ও সার্টিফিকেট**

All personal data (visited districts, diary, trips) is stored locally in your browser (`localStorage`). There is no backend or account system yet.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm test
npm run build
```

Stack: Vite, React 19, TypeScript, Tailwind CSS 4, lucide-react, jsPDF.

Built by মোঃ হাসিবুল হাসান (Md. Hasibul Hasan). Photo data credits are listed per image in `public/places.json`.
