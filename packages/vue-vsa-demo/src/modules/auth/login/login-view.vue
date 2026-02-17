<script setup lang="ts">
import { ref } from 'vue';
import AppButton from '../../../shared/ui/app-button.vue';
import AppInput from '../../../shared/ui/app-input.vue';
import { createLoginCommand } from './login.command';
import { authState } from '../auth.state';

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  try {
    const command = createLoginCommand({
      setUser: authState.setUser
    })({
      username: username.value,
      password: password.value
    });

    await command.execute();
  } catch (e) {
    if (e instanceof Error) {
      error.value = e.message;
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <AppInput
        id="username"
        v-model="username"
        label="Username"
      />
      <AppInput
        id="password"
        v-model="password"
        label="Password"
        type="password"
      />

      <div
        v-if="error"
        class="error"
      >
        {{ error }}
      </div>

      <AppButton
        type="submit"
        :label="loading ? 'Logging in...' : 'Login'"
      />
    </form>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}
.error {
  color: red;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}
</style>
