<template>
    <div class="features-slide" :style="{ backgroundColor: backgroundColor }">
        <div class="features-content">
            <h2>{{ title }}</h2>
            <ul class="features-list">
                <li v-for="item in items" :key="item.id">
                    {{ item.icon }} {{ item.title }}
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

// Features slide data
const title = "Key Features"
const items = [
    { id: 1, icon: "🎯", title: "Smooth Scrolling" },
    { id: 2, icon: "🎨", title: "Multiple Animation Types" },
    { id: 3, icon: "👆", title: "Touch & Drag Support" },
    { id: 4, icon: "⌨️", title: "Keyboard Navigation" },
    { id: 5, icon: "🎭", title: "Flexible Slide Types" },
    { id: 6, icon: "📱", title: "Responsive Design" },
    { id: 7, icon: "⚡", title: "Performance Optimized" },
    { id: 8, icon: "🎪", title: "Interactive Elements" },
    { id: 9, icon: "🔧", title: "Highly Customizable" }
]
</script>
<style scoped>
.features-slide {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.features-content {
    text-align: center;
    max-width: 800px;
}

h2 {
    color: white;
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: 600;
}

.features-list {
    list-style: none;
    padding: 0;
    text-align: left;
    margin: 2rem auto;
}

.features-list li {
    color: white;
    font-size: 1.3rem;
    padding: 0.5rem 0;
    text-align: center;
}
</style>