<script setup lang="ts">
defineProps<{
  modelValue: string;
  label: string;
  type?: string;
  id: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <div class="input-group">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      :type="type || 'text'"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
  </div>
</template>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
label {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #333;
}
input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
