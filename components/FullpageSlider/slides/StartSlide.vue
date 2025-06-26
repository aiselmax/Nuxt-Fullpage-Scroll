<template>
    <div class="hero-slide" :style="{ backgroundColor: backgroundColor }">
        <div class="hero-content">
            <h1>{{ title }}</h1>
            <p>{{ subtitle }}</p>
        </div>
    </div>
</template>
<script setup>
// Props
defineProps({
    backgroundColor: {
        type: String,
        default: 'transparent'
    }
})

// Hero slide data
const title = "Fullpage Scrolling"
const subtitle = "Nuxt 3 + GSAP Integration"
</script>
<style scoped>
.hero-slide {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.hero-content {
    text-align: center;
    max-width: 800px;
}

h1 {
    color: white;
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: 600;
}

p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.2rem;
    margin-bottom: 2rem;
}
</style>