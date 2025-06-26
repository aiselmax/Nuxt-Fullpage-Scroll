<template>
    <div ref="fullpageWrapperRef" class="fullpage-wrapper">
        <SliderArrow 
            direction="up" 
            position="left-center" 
            :slide-count="slideCount" 
            :progress="dotProgress" 
            @click="handleArrowClick" 
        />
        <SliderArrow 
            direction="down" 
            position="left-center" 
            :slide-count="slideCount" 
            :progress="dotProgress" 
            @click="handleArrowClick" 
        />
        
        <!-- Slides werden hier direkt gerendert -->
        <div ref="slidesWrapperRef">
            <section 
                v-for="(slide, index) in slides" 
                :key="index" 
                :ref="el => setSlideRef(el, index)" 
                class="slide" 
                :class="{ 'slide--active': index === activeSlide }" 
                :style="{ backgroundColor: slide.color }"
            >
                <!-- Lazy load: Only render content for visible slides -->
                <template v-if="shouldRenderSlide(index)">
                    <slot 
                        :slide="slide" 
                        :index="index" 
                        name="slide"
                    >
                        <!-- Default slide content -->
                        <a v-if="slide.title" :href="slide.link || '#'">
                            <h3>{{ slide.title }}</h3>
                        </a>
                        <p v-if="slide.content">{{ slide.content }}</p>
                    </slot>
                </template>
            </section>
        </div>
        
        <SliderDots 
            :slide-count="slideCount" 
            :tool-tips="toolTips" 
            :progress="dotProgress" 
            @dot-click="goToSlide" 
        />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import SliderArrow from '~/components/FullpageSlider/SliderArrow.vue'
import SliderDots from '~/components/FullpageSlider/SliderDots.vue'

const props = defineProps({
    slides: {
        type: Array,
        required: true
    },
    animationType: {
        type: String,
        default: 'default'
    }
})

// Reactive slides für das Composable
const slidesRef = computed(() => props.slides)

const {
    fullpageWrapperRef,
    slidesWrapperRef,
    setSlideRef,
    activeSlide,
    dotProgress,
    slideCount,
    toolTips,
    handleArrowClick,
    goToSlide
} = useFullpageScroll(slidesRef, props.animationType)

// Performance: Only render current slide + 1 adjacent slide
const shouldRenderSlide = (index) => {
    const current = activeSlide.value
    return Math.abs(index - current) <= 1
}

</script>

<style scoped>
.fullpage-wrapper {
    position: fixed;
    top: 64px;
    left: 0;
    width: 100%;
    height: calc(100vh - 64px);
    overflow: hidden;
}

.slide {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    text-align: center;
    backface-visibility: hidden;
}

/* Performance: Only optimize active slides */
.slide--active {
    will-change: transform, opacity;
}
</style>