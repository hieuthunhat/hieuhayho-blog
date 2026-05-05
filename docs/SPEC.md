# Portfolio site spec

## Mục tiêu
Dựng một trang portfolio cá nhân (single page) cho product designer / developer freelance, theo hướng tối giản hiện đại với background blueprint dot grid đặc trưng.

## Tech stack
- **Framework**: Next.js 15 (App Router) hoặc Vite + React 18 — chọn cái nào tiện hơn
- **Styling**: Tailwind CSS v4 (hoặc v3 nếu ổn định hơn cho shadcn)
- **Components**: shadcn/ui (cài qua `npx shadcn@latest init` rồi add từng component)
- **Icons**: lucide-react
- **Font**: Inter hoặc Geist Sans (sans-serif modern)
- **Language**: TypeScript

## shadcn components cần add
```
npx shadcn@latest add button card badge separator avatar input
```

## Design system

### Background — đặc trưng nhất của site
Dot grid kiểu blueprint, áp dụng cho `<body>` hoặc container ngoài cùng:
```css
background-color: #ffffff;
background-image: radial-gradient(circle, #1d4ed8 1.2px, transparent 1.2px);
background-size: 32px 32px;
background-position: 0 0;
```
- Nền trắng tinh
- Chấm tròn màu xanh `#1d4ed8` (Tailwind blue-700), bán kính 1.2px
- Grid spacing 32px x 32px — thoáng, hiện đại, không bị rối
- Các chấm xếp thẳng hàng nhau theo cả trục ngang và dọc

### Color tokens
- **Accent chính**: `blue-700` (#1d4ed8) — dùng cho primary buttons, logo bg, dấu nhấn
- **Text đậm**: `blue-950` (#172554) — dùng cho headings và logo text thay vì đen tuyền, giữ tone blueprint
- **Text body**: dùng `text-muted-foreground` của shadcn cho mô tả phụ
- **Card surface**: trắng tinh `#ffffff` để "nổi" lên trên nền chấm
- **Soft accent backgrounds** cho project preview (mỗi card một tone nhạt khác nhau):
  - Blue 50 `#E6F1FB` + accent `#185FA5`
  - Coral 50 `#FAECE7` + accent `#D85A30`
  - Teal 50 `#E1F5EE` + accent `#1D9E75`
  - Purple 50 `#EEEDFE` + accent `#534AB7`

### Typography
- H1 hero: 36-40px, font-weight 500, line-height 1.25, max-width ~520px
- H2 section: 18px, font-weight 500
- Body: 15-16px, line-height 1.6-1.7
- Stat numbers: 24px, font-weight 500
- Small/meta: 12-13px, color muted
- **Sentence case** xuyên suốt (không Title Case, không UPPERCASE)

### Layout rules
- Container max-width: ~1024px (max-w-5xl), căn giữa, padding 32px
- Card border: `0.5px` thay vì 1px (tinh tế hơn)
- Border radius: `rounded-lg` cho card lớn, `rounded-md` cho element nhỏ
- Gap giữa các card: 12px (gap-3)
- Vertical spacing giữa sections: 24px (mb-6) hoặc 32px (mb-8)

## Cấu trúc trang (theo thứ tự từ trên xuống)

### 1. Navigation
- Logo bên trái: avatar vuông `rounded-md` 32x32px, nền `blue-700`, chữ "M" trắng
- Tên brand "minh.dev" cạnh logo, font-weight 500, màu `blue-950`
- Menu bên phải: 4 link text (`work`, `about`, `writing`, `contact`), text-sm, hover underline
- Margin-bottom 48px (mb-12)

### 2. Hero card
- Card trắng, padding 40px (p-10)
- Badge ở trên cùng: variant `secondary`, nền `blue-50`, text `blue-900`, có icon `Sparkles` 12px bên trái, nội dung "available for work · 2026"
- Headline H1: "Product designer crafting calm, considered interfaces." — text-4xl, max-w-xl
- Paragraph mô tả: text-base, color muted, max-w-xl, ~2-3 câu
- 2 buttons:
  - Primary: "view work" + icon `ArrowRight`, nền `blue-700` hover `blue-800`
  - Outline: "get in touch"

### 3. Stats grid
- 4 metric cards xếp ngang (md:grid-cols-4, mobile grid-cols-2)
- Mỗi card padding 16px (p-4):
  - Label trên: text-xs, muted
  - Số dưới: text-2xl, font-medium, màu `blue-950`
- Nội dung: `42 projects shipped`, `7 years building`, `28 happy clients`, `∞ coffee per week`

### 4. Selected work
- Header section: H2 "selected work" bên trái, text-xs muted "2024 — 2026" bên phải, mb-4
- Grid 2 cột (md:grid-cols-2), gap 12px
- Mỗi project card padding 20px (p-5), `cursor-pointer`, `hover:border-blue-300`:
  - Preview block: height 96px (h-24), nền soft accent, có 1 shape geometric ở giữa (vuông xoay 45deg, tròn, hoặc parallelogram) màu accent đậm
  - Tên project: text-sm, font-medium
  - Type/category: text-xs muted
  - Năm: text-xs muted, align-right
  - 2-3 tag dưới cùng: Badge variant `outline`, text-xs, font-normal

Danh sách 4 projects:
1. **Fenway Banking** — Mobile redesign, 2025, tags: `fintech`, `mobile`
2. **Pulse Analytics** — Dashboard system, 2025, tags: `b2b`, `data viz`
3. **Verde wellness** — Brand & web, 2025, tags: `brand`, `web`
4. **Lumen design system** — Internal tooling, ongoing, tags: `systems`, `tokens`

### 5. Tools & stack
- Card với CardHeader + CardContent
- Title "tools & stack", description "things I reach for daily"
- Body: flex-wrap gap-2, các Badge variant `secondary` nền `blue-50` text `blue-900`
- Tools: `Figma`, `Framer`, `React`, `Tailwind`, `Notion`, `Linear`, `Webflow`

### 6. Contact CTA
- Card padding 24px (p-6)
- Top row: flex justify-between
  - Left: "Have a project in mind?" (font-medium) + sub "Booking from June 2026 · responses within 24h" (text-sm muted)
  - Right: button primary "say hello" + icon ArrowRight
- Separator (my-4)
- Bottom row: flex gap-3
  - Input email "your@email.com" — flex-1
  - 3 icon buttons (variant outline, size icon): Mail, Github, Twitter

### 7. Footer
- Text căn giữa, text-xs muted: "© 2026 minh.dev · made with care in Hanoi"

## Component patterns chú ý

### Hover states
- Project cards: `hover:border-blue-300` để có cảm giác interactive
- Nav links: `hover:underline`
- Tool badges: `hover:bg-blue-100`

### Responsive
- Mobile: stats grid 2 cột, project grid 1 cột, hero padding giảm xuống p-6
- Desktop: layout như mô tả ở trên
- Container luôn có padding ngang để không sát mép màn hình

### Accessibility
- Alt text cho avatar fallback
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<footer>`
- Heading hierarchy đúng: 1 H1, các H2 cho từng section
- Link rõ ràng với `aria-label` cho icon buttons

## Dark mode (optional, làm sau cũng được)
Nếu làm dark mode:
- Background: nền `slate-950` thay vì trắng, chấm chuyển sang `blue-400` opacity 0.4
- Card: nền `slate-900`
- Tất cả `blue-950` text chuyển sang `blue-100`
- Soft accent backgrounds dùng các stop 800-900 thay vì 50

## Output mong muốn
- Một file `app/page.tsx` (Next.js) hoặc `src/App.tsx` (Vite) chứa toàn bộ portfolio
- Tách thành các sub-component nếu thấy hợp lý: `<Hero />`, `<Stats />`, `<WorkGrid />`, `<ToolsCard />`, `<ContactCard />`
- Background dot grid áp dụng ở `<body>` (qua `globals.css`) hoặc wrapper div ngoài cùng
- Responsive đầy đủ, test ở 375px, 768px, 1024px

## Tham khảo
File `Portfolio.jsx` đính kèm là demo prototype — code đó dùng được nhưng cần chỉnh lại để chạy trong env Next.js/Vite có shadcn cài chuẩn (đổi sang TypeScript, fix path import nếu cần, đảm bảo Tailwind v4 syntax đúng).
