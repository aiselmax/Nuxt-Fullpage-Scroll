<template>
  <FullpageContainer :slides="slides" animation-type="default">
    <template #slide="{ slide, index }">
      <div :key="index" class="slide">
        <!-- start Slide -->
        <StartSlide 
          v-if="slide.type === 'start'"
        />

        <!-- Features Slide -->
        <FeaturesSlide 
          v-else-if="slide.type === 'features'"
        />

        <!-- Animation Types Slide -->
        <AnimationsSlide 
          v-else-if="slide.type === 'animations'"
        />

        <!-- Contact Slide -->
        <ContactSlide 
          v-else-if="slide.type === 'contact'"
        />
      </div>
    </template>
  </FullpageContainer>
</template>

<script setup>
import FullpageContainer from '~/components/FullpageSlider/FullpageContainer.vue'
import StartSlide from '~/components/FullpageSlider/slides/StartSlide.vue'
import FeaturesSlide from '~/components/FullpageSlider/slides/FeaturesSlide.vue'
import AnimationsSlide from '~/components/FullpageSlider/slides/AnimationsSlide.vue'
import ContactSlide from '~/components/FullpageSlider/slides/ContactSlide.vue'

// Slide configuration with metadata only
const slides = ref([
  {
    type: 'start',
    color: "#1a1a2e",
    tooltip: "start"
  },
  {
    type: 'features',
    color: "#16213e", 
    tooltip: "Features"
  },
  {
    type: 'animations',
    color: "#0f3460",
    tooltip: "Animations"
  },
  {
    type: 'contact',
    color: "#533483",
    tooltip: "Contact"
  }
])
</script>

<style scoped>
.slide {
  width: 100%;
  height: 100%;
}
</style>