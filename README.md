# dear.luv – AI Love Poem Builder

> Craft love into words, instantly.

A beautiful Vue 3 application that helps people express love through personalized AI-generated poetry.

## ✨ Features

- **Anonymous-First**: No login required to create poems
- **Multi-Step Creation Flow**: Guided experience for poem creation
- **Multiple Poem Styles**: Classic, playful, passionate, haiku, and premium options
- **Photo Enhancement**: Optional photo upload for personalization
- **Soft Monetization**: Premium features with emotional upgrade prompts
- **Local Persistence**: Drafts saved automatically
- **Share & Save**: Easy sharing to social media

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
dearluv/
├── src/
│   ├── components/          # Reusable components
│   │   ├── BaseModal.vue
│   │   ├── StepDetails.vue
│   │   ├── StepPhoto.vue
│   │   ├── StepStyle.vue
│   │   ├── PremiumModal.vue
│   │   ├── SaveModal.vue
│   │   ├── ShareModal.vue
│   │   ├── CopiedModal.vue
│   │   └── LimitModal.vue
│   ├── views/              # Page components
│   │   ├── Landing.vue
│   │   ├── Creator.vue
│   │   └── PoemDisplay.vue
│   ├── composables/        # Composition API logic
│   │   ├── useUser.js
│   │   └── usePoemGenerator.js
│   ├── App.vue            # Root component
│   ├── main.js            # Entry point
│   └── style.css          # Global styles
├── public/
├── index.html
├── vite.config.js
└── package.json
```

## 🎨 Design Philosophy

dear.luv follows an **emotion-first** design approach:

- **Typography**: Cormorant Garamond (serif), Crimson Pro (body), Homemade Apple (script)
- **Color Palette**: Rose (#8B475D), Cream (#FFF8F3), Gold (#C9A572)
- **Aesthetic**: Romantic editorial - like Vogue meets handwritten love letters
- **Animations**: Subtle, elegant transitions that feel premium

## 🔧 Key Technical Decisions

### State Management
Uses Vue 3 Composition API with composables instead of Vuex/Pinia for simplicity.

### Anonymous User Tracking
- UUID generated and stored in localStorage
- Anonymous poems can be claimed after signup
- Generation limits enforced per anonymous ID

### Routing
- `/` - Landing page
- `/create` - Multi-step poem creator
- `/poem/:id?` - Poem display (supports "generating" state)

### Local Storage Schema
```javascript
{
  "dearluv_anonymous_id": "uuid-string",
  "dearluv_generation_count": 0-2,
  "dearluv_draft": {
    name: "",
    description: "",
    photoPreview: "base64-string",
    style: "style-id"
  }
}
```

## 🎯 Product Requirements

### Free Tier
- 2 poems per day
- 4 free styles (classic, playful, passionate, haiku)
- Watermarked output
- No saving

### Premium Tier (Upgrade Prompts)
- Unlimited poems
- All 6 styles unlocked
- No watermark
- Save & edit poems
- HD downloads

## 🔌 API Integration (Production)

In production, `usePoemGenerator.js` would call the Claude API:

```javascript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `Create a ${style} love poem about ${name}. ${description}`
    }]
  })
})
```

## 🎨 Customization

### Adding New Poem Styles

Edit `src/composables/usePoemGenerator.js`:

```javascript
export const poemStyles = [
  {
    id: 'new-style',
    name: 'New Style',
    description: 'Description of the style',
    premium: false
  }
]
```

### Adjusting Free Tier Limits

Edit `src/composables/useUser.js`:

```javascript
const maxFreeGenerations = 2 // Change this value
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint: 768px
- Touch-friendly buttons
- Optimized typography scales

## 🚢 Deployment

```bash
# Build for production
npm run build

# Deploy dist/ folder to:
# - Vercel
# - Netlify
# - Cloudflare Pages
# - Any static host
```

### Environment Variables (Production)
```
VITE_API_KEY=your-anthropic-api-key
VITE_API_ENDPOINT=https://api.anthropic.com/v1/messages
```

## 📊 Analytics Events (To Implement)

Track these events for product optimization:
- `poem_generated` - Style, has_photo, description_length
- `upgrade_prompt_shown` - Trigger type
- `upgrade_clicked` - From which prompt
- `poem_shared` - Platform
- `limit_reached` - Generation count

## 🎭 Future Enhancements

- [ ] Multiple language support
- [ ] Voice input for descriptions
- [ ] Collaborative poem editing
- [ ] Public poem gallery
- [ ] Print-to-order physical cards
- [ ] Poem history for logged-in users
- [ ] A/B testing framework for upgrade copy

## 📄 License

Proprietary - All rights reserved

## 🤝 Contributing

This is a private project. For questions, contact the development team.

---

Built with ♥ using Vue 3, Vite, and Claude AI
