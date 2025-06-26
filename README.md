# Nuxt 3 Fullpage Scroll

A modern, performant fullpage scrolling component for Nuxt 3 applications with smooth GSAP animations, drag support, and customizable slide types.

## ✨ Features

- 🎯 **Smooth Scrolling**: GSAP-powered animations with multiple easing options
- 🎨 **Multiple Animation Types**: Default, overshoot, elastic, scale, rotate, bounce, fade, tilt, split, flip
- 👆 **Touch & Drag Support**: Native drag scrolling with momentum and snap
- ⌨️ **Keyboard Navigation**: Arrow keys, Home, End support
- 🎭 **Flexible Slide Types**: Hero, Features, Stats, Contact, and custom slides
- 📱 **Responsive Design**: Works seamlessly across all devices
- ⚡ **Performance Optimized**: Lazy loading and efficient rendering
- 🎪 **Interactive Elements**: Navigation arrows and dot indicators
- 🔧 **Highly Customizable**: Easy to extend and modify

## 🚀 Quick Start

### Prerequisites

- Node.js 16.x or higher
- Nuxt 3 project
- GSAP 3.x with Draggable plugin

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/aiselmax/nuxt3-fullpage-scroll.git
cd nuxt3-fullpage-scroll
```

2. **Install dependencies**
```bash
# npm
npm install
# pnpm
pnpm install
# yarn
yarn install
# bun
bun install
```

3. **Install GSAP (if not already installed)**
```bash
npm install gsap
```

4. **Configure GSAP plugin in Nuxt**

Create or update `plugins/gsap.client.js`:
```javascript
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'

export default defineNuxtPlugin(() => {
  if (process.client) {
    gsap.registerPlugin(Draggable)
    return {
      provide: {
        gsap,
        draggable: Draggable
      }
    }
  }
})
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev
# pnpm
pnpm dev
# yarn
yarn dev
# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build
# pnpm
pnpm build
# yarn
yarn build
# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview
# pnpm
pnpm preview
# yarn
yarn preview
# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## 📖 Usage

### Basic Implementation

```vue
<template>
  <FullpageContainer :slides="slides" animation-type="default">
    <template #slide="{ slide, index }">
      <!-- Your custom slide content -->
      <div class="custom-slide">
        <h2>{{ slide.title }}</h2>
        <p>{{ slide.content }}</p>
      </div>
    </template>
  </FullpageContainer>
</template>

<script setup>
const slides = ref([
  {
    type: 'hero',
    color: '#1a1a2e',
    title: 'Welcome',
    subtitle: 'Your subtitle here',
    buttonText: 'Get Started',
    tooltip: 'Home'
  },
  {
    type: 'features',
    color: '#16213e',
    title: 'Features',
    tooltip: 'What we offer',
    features: [
      {
        id: 1,
        icon: '🚀',
        title: 'Fast',
        description: 'Lightning fast performance'
      }
    ]
  }
])
</script>
```

### Available Animation Types

```javascript
// Choose from these animation types
const animationTypes = [
  'default',    // Smooth power2.inOut
  'overshoot',  // Back easing with overshoot
  'elastic',    // Elastic bounce effect
  'scale',      // Scale animation during transition
  'rotate',     // Rotation effect
  'bounce',     // Bounce.out easing
  'fade',       // Fade transition
  'tilt',       // 3D tilt effect
  'split',      // Split movement
  'flip'        // Flip rotation
]
```

## ⚙️ Configuration

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `slides` | Array | required | Array of slide objects |
| `animationType` | String | 'default' | Animation type for transitions |

### Composable Configuration

```javascript
const CONFIG = {
  ANIMATION_DURATION: 0.6,      // Animation duration in seconds
  ANIMATION_EASE: 'power2.inOut', // Default easing
  EDGE_RESISTANCE: 1,           // Drag edge resistance
  WHEEL_DEBOUNCE: 80,          // Wheel event debounce (ms)
  WHEEL_THRESHOLD: 30,         // Minimum wheel delta
  RESIZE_DEBOUNCE: 100,        // Resize debounce (ms)
  SNAP_THRESHOLD: 10           // Snap sensitivity
}
```

## 🎮 Controls

### Keyboard Navigation
- `↑` / `↓` - Navigate between slides
- `Home` - Go to first slide
- `End` - Go to last slide

### Mouse/Touch
- **Wheel scrolling** - Navigate slides
- **Drag/Swipe** - Touch-friendly navigation
- **Navigation arrows** - Click to navigate
- **Dot indicators** - Click to jump to specific slide

## 🔧 Customization

### Custom Animations

Add your custom animation to the `animations` object in `useFullpageScroll.js`:

```javascript
const animations = {
  // existing animations...
  'yourCustomAnimation': (target, y) => gsap.to(target, {
    y,
    duration: CONFIG.ANIMATION_DURATION,
    ease: 'your.ease',
    onUpdate: updateDotProgress
  })
}
```

## 🎯 Performance Features

- **Lazy Loading**: Only renders visible slides ± 1 adjacent slide
- **Optimized Animations**: Uses GSAP's performance optimizations
- **Debounced Events**: Wheel and resize events are properly debounced
- **Memory Management**: Automatic cleanup on component unmount
- **Efficient DOM Updates**: Minimal DOM manipulations

## 🐛 Troubleshooting

### Common Issues

**GSAP not working:**
- Ensure GSAP is properly registered in your Nuxt plugin
- Check that Draggable plugin is imported and registered

**Slides not scrolling:**
- Verify that slides array is reactive (`ref` or `reactive`)
- Check browser console for JavaScript errors
- Ensure proper DOM structure is rendered

**Performance issues:**
- Reduce animation duration if needed
- Check for memory leaks in custom slide components
- Use `shouldRenderSlide` for heavy content

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [GSAP](https://greensock.com/) for amazing animation capabilities
- [Nuxt 3](https://nuxt.com/) for the awesome framework
- [Vue 3](https://vuejs.org/) for the reactive foundation

## 📞 Support

If you have any questions or need help, please [open an issue](https://github.com/aiselmax/nuxt3-fullpage-scroll/issues).
