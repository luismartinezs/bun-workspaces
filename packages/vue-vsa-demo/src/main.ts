import { createApp } from 'vue';
import './style.css';
import App from './app.vue';
import { authService } from './modules/auth/auth.public';

const app = createApp(App);

// Dependency Injection / Composition Root
// We provide the authService to the app so that Dashboard module can use it
// without importing it directly from Auth module (it injects 'authService' token)
app.provide('authService', authService);

app.mount('#app');
