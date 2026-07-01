# Royale Trading Company

Premium export-brand website for Indian cardamom and spices — elegant white & green palette, editorial typography, and international buyer focus.

## Brand

- **Name:** Royale Trading Company
- **Contact:** +91 75109 95173 · alenroy1000@gmail.com
- **Palette:** Forest green `#1F4D3A`, botanical `#2E6B4B`, leaf `#6FAE7A`, warm white `#FAFAF7`, muted gold accents `#C9A86A`
- **Typography:** Playfair Display + Cormorant Garamond (headings), Inter (body)

## Tech stack

Vite + HTML + CSS + vanilla JS — lightweight, no framework.

## Run locally

```powershell
cd "d:\royale-trading-co"
npm run dev
```

Open http://localhost:5173

## Build

```powershell
npm run build
```

Deploy the `dist/` folder to Netlify, Vercel, or GitHub Pages.

## Contact form

Submissions are sent via [FormSubmit](https://formsubmit.co) to **alenroy1000@gmail.com**.

**First-time setup:** Submit the form once, then open the activation email from FormSubmit and click the link. After that, every inquiry arrives in your inbox with name, company, inquiry type, and message.

## Images

Product photos use verified [Unsplash](https://unsplash.com/license) IDs matched to each spice (plantation hero, cardamom, black pepper, cinnamon, clove, ginger). Verify before deploy:

```powershell
powershell -File scripts/verify-index-images.ps1
```

Replace URLs in `index.html` with your own product photography when ready.
