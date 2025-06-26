<script setup>
import { gsap } from 'gsap'
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  slideCount: {
    type: Number,
    required: true
  },
  toolTips: {
    type: Array,
    required: true
  },
  progress: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['dot-click'])

const dotAnim = ref(null)
const dotsContainer = ref(null)
const dotRefs = ref([])
const hoveredIndex = ref(-1)

onMounted(() => {
  dotAnim.value = gsap.timeline({ paused: true })
 
  if (dotRefs.value.length > 0) {
    dotAnim.value.to(
      dotRefs.value,
      {
        stagger: {
          each: 1,
          yoyo: true,
          repeat: 1
        },
        scale: 2.1,
        rotation: 0.1,
        ease: 'none'
      },
      0.5
    )
   
    dotAnim.value.time(props.progress)
  }
})

onUnmounted(() => {
  if (dotAnim.value) {
    dotAnim.value.kill()
  }
})

watch(() => props.progress, (newProgress) => {
  if (dotAnim.value) {
    dotAnim.value.time(newProgress)
  }
})

const handleDotClick = (index) => {
  emit('dot-click', index)
}

const showTooltip = (index) => {
  // Tooltip nur anzeigen wenn nicht gerade animiert wird
  if (props.progress % 1 === 0) {
    hoveredIndex.value = index
  }
}

const hideTooltip = () => {
  hoveredIndex.value = -1
}

const getAriaLabel = (index) => {
  const slideNumber = index + 1
  const tooltip = props.toolTips[index] ? `: ${props.toolTips[index]}` : ''
  return `Go to slide ${slideNumber}${tooltip}`
}

const setDotRef = (el, index) => {
  if (el) {
    dotRefs.value[index] = el
  }
}
</script>

<template>
  <div class="dots-container" ref="dotsContainer">
    <div
      v-for="(_, index) in slideCount"
      :key="index"
      class="dot-wrapper"
    >
      <button
        :ref="(el) => setDotRef(el, index)"
        type="button"
        class="dot"
        :aria-label="getAriaLabel(index)"
        @click="handleDotClick(index)"
        @mouseenter="showTooltip(index)"
        @mouseleave="hideTooltip"
      >
        <span class="dot__circle"></span>
        <span 
          v-if="toolTips[index]"
          class="tooltip"
          :class="{ 'tooltip--visible': hoveredIndex === index }"
        >
          {{ toolTips[index] }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.dots-container {
  position: fixed;
  z-index: 100;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dot-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot {
  position: relative;
  height: 40px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot:hover .dot__circle {
  transform: scale(1.15);
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.6));
  box-shadow: 
    0 3px 6px rgba(0, 0, 0, 0.3),
    inset 0 1px 3px rgba(255, 255, 255, 0.4);
}

.dot:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: 4px;
  border-radius: 50%;
}

.dot__circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.4));
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.3);
  transform-origin: center;
  transform: scale(1);
  transition: all 0.3s ease;
}

.tooltip {
  position: absolute;
  top: 50%;
  right: calc(100% + 12px);
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  pointer-events: none;
}

.tooltip--visible {
  opacity: 1;
  visibility: visible;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-left-color: rgba(0, 0, 0, 0.9);
}

@media (max-width: 768px) {
  .dots-container {
    right: 8px;
  }
  
  .tooltip {
    display: none;
  }
}

@media (max-width: 480px) {
  .dot__circle {
    width: 10px;
    height: 10px;
  }
}

@media (hover: none) {
  .tooltip {
    display: none;
  }
}
</style>