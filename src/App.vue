<script setup>
import AppBar from './components/AppBar.vue'
import FooterBar from './components/FooterBar.vue'
import Toast from './components/Toast.vue'
</script>

<template>
  <AppBar />
  <router-view />
  <FooterBar />
  <Toast />
</template>
