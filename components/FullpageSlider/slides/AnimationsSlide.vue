<template>
    <div class="animations-slide" :style="{ backgroundColor: backgroundColor }">
        <div class="animations-content">
            <h2>{{ title }}</h2>
            <ul class="animations-list">
                <li v-for="item in items" :key="item.id">
                    {{ item.icon }} <code class="animation-name">{{ item.name }}</code>
                </li>
            </ul>
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

// Animations slide data
const title = "Animation Types"
const items = [
    { id: 1, name: "default", icon: "🎞️" },
    { id: 2, name: "overshoot", icon: "🎯" },
    { id: 3, name: "elastic", icon: "🪀" },
    { id: 4, name: "scale", icon: "📏" },
    { id: 5, name: "rotate", icon: "🔄" },
    { id: 6, name: "bounce", icon: "🏀" },
    { id: 7, name: "fade", icon: "🌫️" },
    { id: 8, name: "tilt", icon: "🧭" },
    { id: 9, name: "split", icon: "🪓" },
    { id: 10, name: "flip", icon: "🪞" }
]
</script>
<style scoped>
.animations-slide {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.animations-content {
    text-align: center;
    max-width: 800px;
}

h2 {
    color: white;
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: 600;
}

.animations-list {
    list-style: none;
    padding: 0;
    text-align: left;
    margin: 2rem auto;
}

.animations-list li {
    color: white;
    font-size: 1.3rem;
    padding: 0.5rem 0;
    text-align: center;
}

.animation-name {
    color: #4ecdc4;
    font-family: 'Courier New', monospace;
    font-size: 1.1rem;
    font-weight: bold;
}
</style>