<template>
    <div class="contact-slide" :style="{ backgroundColor: backgroundColor }">
        <div class="contact-content">
            <h2>{{ title }}</h2>
            <p>{{ subtitle }}</p>
            <div class="follow">
                <a v-for="link in links" :key="link.url" :href="link.url" target="_blank" class="link">
                    {{ link.icon }} {{ link.text }}
                </a>
            </div>
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

// Contact slide data
const title = "Follow Me"
const subtitle = "Let's connect and build amazing things together"
const links = [
    {
        url: "https://www.aisel.eu",
        icon: "🌐",
        text: "www.aisel.eu"
    },
    {
        url: "https://github.com/aiselmax",
        icon: "🐙",
        text: "github.com/aiselmax"
    }
]
</script>
<style scoped>
.contact-slide {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.contact-content {
    text-align: center;
    max-width: 800px;
}

h2 {
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

.link {
    color: #4ecdc4;
    text-decoration: none;
    font-size: 1.1rem;
    transition: all 0.2s ease;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 25px;
    backdrop-filter: blur(10px);
}

.link:hover {
    color: white;
    background: rgba(255, 255, 255, 0.2);
}

.follow {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
}
</style>