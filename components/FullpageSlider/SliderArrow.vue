<template>
    <div 
        class="arrow-container"
        :class="[positionClass, directionClass]"
        @click="handleClick"
        ref="arrowContainer">
        <svg
            class="arrow-progress"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 100 100">
            <!-- Background circle -->
            <circle 
                class="progress-bg"
                r="46" 
                cx="50" 
                cy="50" 
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                stroke-width="4" />
            <!-- Progress circle -->
            <circle 
                class="progress-circle"
                r="46" 
                cx="50" 
                cy="50" 
                fill="none"
                stroke="white"
                stroke-width="4"
                stroke-linecap="round"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="dashOffset"
                :transform="circleTransform" />
        </svg>
        
        <svg
            class="arrow-icon"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 100 100">
            <!-- Arrow shape -->
            <g stroke-linejoin="round" stroke-linecap="round">
                <!-- Modern arrow design -->
                <path 
                    v-if="direction === 'up'" 
                    d="M30 55 L50 35 L70 55 M50 35 L50 65"
                    stroke="white"
                    stroke-width="6"
                    fill="none" />
                <path 
                    v-if="direction === 'down'" 
                    d="M30 45 L50 65 L70 45 M50 35 L50 65"
                    stroke="white"
                    stroke-width="6"
                    fill="none" />
            </g>
        </svg>
    </div>
</template>

<script setup>
import { gsap } from 'gsap'
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
    direction: {
        type: String,
        required: true,
        validator: value => ['up', 'down'].includes(value)
    },
    position: {
        type: String,
        default: 'left-center',
        validator: value => [
            'right-top', 'right-bottom', 'right-center',
            'left-top', 'left-bottom', 'left-center',
            'bottom-center'
        ].includes(value)
    },
    slideCount: {
        type: Number,
        required: true
    },
    progress: {
        type: Number,
        required: true
    }
})

const emit = defineEmits(['click'])
const arrowContainer = ref(null)
const arrowAnim = ref(null)

// Progress circle calculations
const circumference = computed(() => 2 * Math.PI * 46)

const dashOffset = computed(() => {
    const progressRatio = Math.max(0, Math.min(1, (props.progress - 1) / (props.slideCount - 1)))
    
    if (props.direction === 'up') {
        // Up-arrow: Kreis befüllt sich von 0 bis slideCount
        return circumference.value * (1 - progressRatio)
    } else {
        // Down-arrow: Kreis befüllt sich umgekehrt (voll bei progress 1, leer bei slideCount)
        return circumference.value * progressRatio
    }
})

const circleTransform = computed(() => {
    if (props.direction === 'up') {
        // Up-arrow: Startet rechts (0°) und befüllt sich im Uhrzeigersinn
        return 'rotate(-90 50 50)'
    } else {
        // Down-arrow: Startet links (180°) und befüllt sich gegen Uhrzeigersinn
        return 'rotate(90 50 50)'
    }
})

const handleClick = () => {
    emit('click', props.direction)
}

const positionClass = computed(() => {
    return `arrow--${props.position}`
})

const directionClass = computed(() => {
    return `arrow--${props.direction}`
})

onMounted(() => {
    // Arrow hover/click animation
    arrowAnim.value = gsap.timeline({ paused: true })
    
    const container = arrowContainer.value
    const icon = container.querySelector('.arrow-icon')
    
    arrowAnim.value
        .to(container, {
            scale: 1.1,
            duration: 0.2,
            ease: 'power2.out'
        })
        .to(icon, {
            y: props.direction === 'up' ? -2 : 2,
            duration: 0.2,
            ease: 'power2.out'
        }, 0)
    
    // Hover events
    container.addEventListener('mouseenter', () => {
        arrowAnim.value.play()
    })
    
    container.addEventListener('mouseleave', () => {
        arrowAnim.value.reverse()
    })
})

onUnmounted(() => {
    if (arrowAnim.value) {
        arrowAnim.value.kill()
    }
})
</script>

<style scoped>
.arrow-container {
    position: fixed;
    z-index: 1000;
    cursor: pointer;
    width: 50px;
    height: 50px;
    transition: opacity 0.3s;
    opacity: 0.8;
}

.arrow-container:hover {
    opacity: 1;
}

.arrow-progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.arrow-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 60%;
    pointer-events: none;
}

.progress-circle {
    transition: stroke-dashoffset 0.3s ease-out;
}

/* Base positions */
.arrow--right-top {
    right: 2px;
    top: 2px;
}

.arrow--right-bottom {
    right: 2px;
    bottom: 2px;
}

.arrow--right-center {
    right: 2px;
    top: 50%;
    transform: translateY(-50%);
}

.arrow--left-top {
    left: 2px;
    top: 2px;
}

.arrow--left-bottom {
    left: 2px;
    bottom: 2px;
}

.arrow--left-center {
    left: 2px;
    top: 50%;
    transform: translateY(-50%);
}

.arrow--bottom-center {
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
}

/* Direction-based offsets for overlapping arrows */
.arrow--right-center.arrow--up {
    transform: translateY(calc(-50% - 35px));
}

.arrow--right-center.arrow--down {
    transform: translateY(calc(-50% + 35px));
}

.arrow--left-center.arrow--up {
    transform: translateY(calc(-50% - 35px));
}

.arrow--left-center.arrow--down {
    transform: translateY(calc(-50% + 35px));
}

.arrow--bottom-center.arrow--up {
    transform: translateX(calc(-50% - 35px));
}

.arrow--bottom-center.arrow--down {
    transform: translateX(calc(-50% + 35px));
}

@media (max-width: 480px) {
    .arrow-container {
        width: 40px;
        height: 40px;
    }
    
    /* Adjust offsets for mobile */
    .arrow--right-center.arrow--up,
    .arrow--left-center.arrow--up {
        transform: translateY(calc(-50% - 30px));
    }
    
    .arrow--right-center.arrow--down,
    .arrow--left-center.arrow--down {
        transform: translateY(calc(-50% + 30px));
    }
    
    .arrow--bottom-center.arrow--up {
        transform: translateX(calc(-50% - 30px));
    }
    
    .arrow--bottom-center.arrow--down {
        transform: translateX(calc(-50% + 30px));
    }
}
</style>