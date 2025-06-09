<template>
  <q-dialog v-model="dialogVisible" persistent>
    <q-card class="auth-card">
      <q-card-section class="bg-primary text-white text-center q-pa-md">
        <div class="text-h5">Welcome to WsFlix</div>
        <div class="text-subtitle2">{{ tab === 'login' ? 'Login to continue' : 'Create your account' }}</div>
      </q-card-section>
      <q-card-section>
        <q-tabs v-model="tab" dense class="text-grey-7" active-color="primary" indicator-color="primary" align="justify" no-caps>
          <q-tab name="login" label="Login" />
          <q-tab name="register" label="Register" />
        </q-tabs>
        <q-separator />
      </q-card-section>
      <q-card-section class="q-pt-none q-px-md">
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="login" class="q-pa-none">
            <q-form @submit.prevent="handleLogin" class="q-gutter-md q-mt-md">
              <q-input filled dense v-model="loginForm.email" label="Email Address" type="email" lazy-rules :rules="[val => !!val || 'Email is required']">
                <template v-slot:prepend><q-icon name="alternate_email" /></template>
              </q-input>
              <q-input filled dense v-model="loginForm.password" label="Password" type="password" lazy-rules :rules="[val => !!val || 'Password is required']">
                <template v-slot:prepend><q-icon name="lock" /></template>
              </q-input>
              <div class="q-py-sm">
                <q-btn label="Login" type="submit" color="primary" class="full-width" :loading="loading" />
              </div>
            </q-form>
          </q-tab-panel>
          <q-tab-panel name="register" class="q-pa-none">
            <q-form @submit.prevent="handleRegister" class="q-gutter-md q-mt-md">
              <q-input filled dense v-model="registerForm.name" label="Full Name" />
              <q-input filled dense v-model="registerForm.username" label="Username" />
              <q-input filled dense v-model="registerForm.email" label="Email Address" type="email" />
              <q-input filled dense v-model="registerForm.password" label="Password" type="password" />
              <div class="q-py-sm">
                <q-btn label="Create Account" type="submit" color="primary" class="full-width" :loading="loading" />
              </div>
            </q-form>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
       <q-card-actions align="center" class="bg-grey-2 q-pa-sm">
        <q-btn flat label="Close" color="dark" v-close-popup class="full-width" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.auth-card { width: 380px; max-width: 90vw; border-radius: 8px; }
</style>

<script setup>
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar'; // Import useQuasar
import { api } from 'boot/axios';
import { store } from 'src/store/store';

const props = defineProps({
  modelValue: Boolean,
  startTab: { type: String, default: 'login' }
});
const emit = defineEmits(['update:modelValue']);

const $q = useQuasar(); // --- THIS IS THE FIX ---
const tab = ref('login');
const loading = ref(false);
const dialogVisible = ref(false);

const loginForm = ref({ email: '', password: '' });
const registerForm = ref({ name: '', username: '', email: '', password: '' });

watch(() => props.modelValue, (newValue) => {
  dialogVisible.value = newValue;
  if (newValue) { tab.value = props.startTab; }
});

const closeDialog = () => { emit('update:modelValue', false); };

const handleLogin = async () => {
  loading.value = true;
  try {
    const response = await api.post('/auth/login', loginForm.value);
    store.setToken(response.data.access_token);
    store.setUser(response.data.user);
    $q.notify({ color: 'positive', message: 'Login successful!' });
    closeDialog();
  } catch (error) {
    console.error('Login failed:', error);
    $q.notify({ color: 'negative', message: 'Login failed. Check credentials.' });
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  loading.value = true;
  try {
    await api.post('/auth/register', registerForm.value);
    $q.notify({ color: 'positive', message: 'Registration successful! Please login.' });
    tab.value = 'login';
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed.';
    console.error('Registration failed:', error);
    $q.notify({ color: 'negative', message: message });
  } finally {
    loading.value = false;
  }
};
</script>