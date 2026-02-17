<script setup lang="ts">
defineProps<{
  label: string;
  type?: 'button' | 'submit';
}>();
</script>

<template>
  <button
    :type="type || 'button'"
    class="app-button"
  >
    {{ label }}
  </button>
</template>

<style scoped>
.app-button {
  padding: 0.5rem 1rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.app-button:hover {
  background-color: #3aa876;
}
</style>
