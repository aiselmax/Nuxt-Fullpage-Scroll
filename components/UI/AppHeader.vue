<template>
    <v-app-bar
      :elevation="2"
      color="primary"
      dark
    >
      <v-app-bar-title>
        <NuxtLink to="/" class="text-decoration-none text-white">
          Fullpage Slider Demo
        </NuxtLink>
      </v-app-bar-title>
  
      <v-spacer />
  
      <v-btn
        icon="mdi-github"
        variant="text"
        href="https://github.com/aiselmax"
        target="_blank"
        aria-label="GitHub"
      />
    </v-app-bar>
  </template>
  
  <script setup>
  // Keine spezielle Logik erforderlich - reine UI-Komponente
  </script>
  
  <style scoped>
  </style>