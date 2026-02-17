<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
import { createLoadStatsCommand } from './load-stats.command';
import type { AuthContract } from '../../auth/auth.public';
import AppButton from '../../../shared/ui/app-button.vue';

// In a real app, we'd define a unique injection key
const authService = inject<AuthContract>('authService');

const stats = ref<{ visits: number; sales: number } | null>(null);
const error = ref('');
const loading = ref(false);

const loadStats = async () => {
  if (!authService) {
    error.value = 'Auth service not provided';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const command = createLoadStatsCommand({ auth: authService });
    stats.value = await command();
  } catch (e) {
    if (e instanceof Error) {
      error.value = e.message;
    }
  } finally {
    loading.value = false;
  }
};

// Auto-load on mount
onMounted(loadStats);
</script>

<template>
  <div class="dashboard">
    <h2>Dashboard</h2>
    <div
      v-if="loading"
      class="loading"
    >
      Loading stats...
    </div>
    <div
      v-else-if="error"
      class="error"
    >
      {{ error }}
      <AppButton
        label="Retry"
        @click="loadStats"
      />
    </div>
    <div
      v-else-if="stats"
      class="stats-grid"
    >
      <div class="card">
        <h3>Visits</h3>
        <p>{{ stats.visits }}</p>
      </div>
      <div class="card">
        <h3>Sales</h3>
        <p>{{ stats.sales }}</p>
      </div>
      <AppButton
        label="Refresh"
        @click="loadStats"
      />
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 2rem;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}
.card {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}
.card h3 {
  margin: 0 0 0.5rem 0;
  color: #666;
}
.card p {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  color: #42b883;
}
.error {
  color: red;
  background: #fee;
  padding: 1rem;
  border-radius: 4px;
}
</style>
