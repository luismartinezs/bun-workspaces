<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { LoginView } from './modules/auth/auth.public';
import { DashboardView } from './modules/dashboard/dashboard.public';
import { eventBus } from './shared/event-bus';

const isLoggedIn = ref(false);

onMounted(() => {
  eventBus.on('USER_LOGGED_IN', () => {
    isLoggedIn.value = true;
  });
});
</script>

<template>
  <div class="app-layout">
    <header>
      <h1>VSA Demo</h1>
    </header>

    <main>
      <LoginView v-if="!isLoggedIn" />
      <DashboardView v-else />
    </main>
  </div>
</template>

<style>
/* Basic Global Styles */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  margin: 0;
  background-color: #f5f5f5;
  color: #333;
}

.app-layout {
  max-width: 800px;
  margin: 0 auto;
}

header {
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #ddd;
  text-align: center;
}
</style>
