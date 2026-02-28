# UI/UX Design Guidelines

## Brand Identity

- **Brand Name**: LyriaSong
- **Visual Direction**: Clean AI workspace with Google-style neutral palette
- **Core Promise Copy**: "Generate 3-Minute Songs with Lyria 3 Fidelity."
- **Tone of Voice**: concise, technical, outcome-driven

## Design System

### Color Palette

#### Primary Brand Colors
```css
--color-google-blue: #1A73E8;
--color-google-gray: #5F6368;
--color-google-dark: #202124;
--color-google-border: #DADCE0;
```

#### Background
- Base page background: white (`bg-white`)
- Header background: translucent white (`bg-white/80`) with blur
- Input background: frosted white (`rgba(255, 255, 255, 0.7)`)

#### Accents
- Primary actions: `google-blue`
- Hover states: darker blue (`hover:bg-blue-600`)
- Focus/active glow: blue shadow animation (`pulse-glow`)

#### Text
- Main heading and key labels: `google-dark`
- Supporting copy: `google-gray`
- Placeholder copy: `google-gray/50`

### Typography Scale

| Element | Size | Weight | Style |
|---------|------|--------|-------|
| Hero Title | `text-4xl` → `lg:text-[56px]` | Medium | Tight tracking, high contrast |
| Hero Subtitle | `text-lg` → `md:text-xl` | Normal | Neutral supporting tone |
| Nav Text | `text-sm` | Medium | Compact top navigation |
| CTA Button | `text-base` | Bold | Strong action emphasis |
| Footer Meta | `text-xs` | Normal | Low visual weight |

### Spacing System

| Element | Value |
|---------|-------|
| Top Header Height | `h-16` |
| Main Top Offset | `pt-16` |
| Hero Bottom Gap | `mb-12` |
| Input Container | `p-4` → `md:p-6` |
| Action Row Gap | `gap-6` |
| Pillar Card Grid | `mt-10`, `gap-0.9rem` |

### Component Styling Conventions

#### Header Navigation

```tsx
className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between
  px-8 bg-white/80 backdrop-blur-sm z-50"
```

#### Input Panel (Glass)

```tsx
className="glass-input relative flex items-center p-4 md:p-6 rounded-[32px]
  border transition-all duration-300"
```

```css
.glass-input {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
}
```

#### Primary CTA

```tsx
className="bg-google-blue text-white px-10 py-4 rounded-full font-bold
  hover:shadow-lg hover:bg-blue-600 active:scale-95 transition-all duration-200"
```

#### Secondary/Utility Buttons

- Icon actions: lightweight icon-only buttons with color shift on hover
- Header login: outlined neutral style (`border-google-border`)
- Toggle rail: neutral gray when off, blue when on

### Copywriting Conventions (Homepage)

- Headline pattern: capability + quality level (example: "3-Minute Songs", "Fidelity")
- Subtitle pattern: short factual claims (example: "Beyond 30 Seconds", "48kHz")
- CTA text pattern: imperative verb + aspirational noun (example: "Compose Masterpiece")
- Input placeholder pattern: scenario prompts (lyrics/image/mood/use case)

### Motion & Interaction

- Entry animation: hero block fades in and moves up (`motion.div`)
- Placeholder rotation: every 4 seconds when input is idle
- Toggle thumb animation: horizontal slide based on fidelity state
- Focus feedback: input border and shadow intensity increase on focus

### Background Treatment

Wave layer (`.bg-wave-container`, `.wave-line`) is used to avoid flat white background and add subtle motion context.

```css
.wave-line {
  background: linear-gradient(90deg, transparent 0%, #E0E0E0 50%, transparent 100%);
  opacity: 0.4;
}
```

### Glassmorphism Effects

- Applied only where user input is central (prompt composer)
- Avoid excessive blur on surrounding cards/pages
- Keep contrast high enough for text readability

## Responsive Breakpoints

| Device | Screen Size | Layout |
|--------|-------------|--------|
| Mobile | < 768px | Stacked CTA row, single-column main flow |
| Tablet | 768px - 1024px | Balanced hero + input, cards wrap naturally |
| Desktop | > 1024px | Full-width hero composition with large input and card grid |

## UI Component Pattern

-**See CLAUDE.md for instructions on adding new components.**

- Radix/shadcn ecosystem is available in dependencies
- Introduce reusable UI components incrementally based on page needs
- Keep visual output consistent with this document's color/type/spacing standards

##  Homepage uses

- Tailwind utility classes for layout and spacing
- Theme tokens from `@theme` in `src/app/globals.css`
- `lucide-react` for media/voice action icons
- `motion` (`motion/react`) for lightweight interaction animation

## Related Files

- `src/app/page.tsx` - Homepage structure and interaction logic
- `src/app/globals.css` - Theme tokens, shared styles, homepage visual primitives
- `src/app/layout.tsx` - Global shell, nav container, font setup
