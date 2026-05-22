# Brand Guidelines v1.0

> Last updated: 2026-05-13
> Status: Active

## Quick Reference

| Element | Value |
|---------|-------|
| Primary Color | #10B981 (emerald) |
| Secondary Color | #0EA5E9 (sky-blue) |
| Accent Color | #F59E0B (amber) |
| Primary Font | Inter |
| Voice | Professional, Empathetic, Trustworthy |

---

## 1. Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Emerald Primary | #10B981 | rgb(16, 185, 129) | CTAs, headers, main branding |
| Emerald Dark | #059669 | rgb(5, 150, 105) | Hover states, emphasis |
| Emerald Light | #34D399 | rgb(52, 211, 153) | Highlights, backgrounds |

### Secondary & Accent Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Sky Blue | #0EA5E9 | rgb(14, 165, 233) | Secondary actions, links |
| Amber Accent | #F59E0B | rgb(245, 158, 11) | Warnings, urgency, highlights |

### Semantic Colors

| State | Hex | Usage |
|-------|-----|-------|
| Success | #22C55E | Positive actions, confirmations |
| Warning | #F59E0B | Cautions, pending states |
| Error | #EF4444 | Errors, destructive actions |
| Info | #3B82F6 | Informational messages |

---

## 2. Typography

### Font Stack

```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
```

### Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 3. Logo Usage

### Variants

| Variant | Icon | Usage |
|---------|------|-------|
| Primary | Lucide `heart-handshake` | Navbar, Main branding |
| Icon Only | Lucide `heart` | Buttons, CTA |

---

## 4. Voice & Tone

### Brand Personality

| Trait | Description |
|-------|-------------|
| **Empathetic** | Mengerti dan peduli terhadap isu sosial |
| **Trustworthy** | Transparan, akuntabel, dan dapat dipercaya |
| **Professional** | Jelas, lugas, dan mudah dipahami |
| **Inspiring** | Mengajak orang untuk berbuat kebaikan |

### Prohibited Terms

| Avoid | Reason |
|-------|--------|
| Memaksa | Donasi harus ikhlas |
| Rumit | Bahasa harus mudah dipahami semua kalangan |

---

## 5. Design Components

### UI/UX Pro Max Aesthetic

Website Donaria menggunakan gaya desain **Glassmorphism** dan **Premium Mesh Backgrounds** sesuai dengan `21st-premium.css`.

- **Background:** Mesh gradient (`.premium-mesh-bg`)
- **Card/Surface:** Glassmorphism dengan border semi-transparan putih/abu-abu.
- **Icons:** Menggunakan pustaka *Lucide Icons*.
- **Shadows:** Soft shadows dengan offset yang dalam untuk memberikan kesan *floating*.

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-05-13 | Initial guidelines for Donaria |
