<template>
  <q-dialog v-model="dialogVisible" persistent>
    <q-card style="width: 350px">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="login" label="Login" />
        <q-tab name="register" label="Register" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login">
          <div class="text-h6 q-mb-md text-center">Sign in</div>
          <q-form @submit.prevent="handleLogin">
            <q-input dense outlined v-model="loginForm.email" label="Email" type="email" class="q-mb-md" />
            <q-input dense outlined v-model="loginForm.password" type="password" label="Password" class="q-mb-md" />
            <q-btn label="Sign in" type="submit" color="primary" class="full-width" :loading="loading" />
          </q-form>
        </q-tab-panel>

        <q-tab-panel name="register">
          <div class="text-h6 q-mb-md text-center">Create Account</div>
          <q-form @submit.prevent="handleRegister">
            <q-input dense outlined v-model="registerForm.name" label="Full Name" class="q-mb-md" />
            <q-input dense outlined v-model="registerForm.username" label="Username" class="q-mb-md" />
            <q-input dense outlined v-model="registerForm.email" label="Email" type="email" class="q-mb-md" />
            <q-input dense outlined v-model="registerForm.password" label="Password" class="q-mb-md" />
            <q-btn label="Sign up" type="submit" color="primary" class="full-width" :loading="loading" />
          </q-form>
        </q-tab-panel>
      </q-tab-panels>

      <q-card-actions align="right">
        <q-btn flat label="Close" color="primary" @click="closeDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import { store } from 'src/store/store';

const props = defineProps({
  modelValue: Boolean,
  startTab: { type: String, default: 'login' }
});
const emit = defineEmits(['update:modelValue']);

const $q = useQuasar();
const tab = ref('login');
const loading = ref(false);
const dialogVisible = ref(false);

const loginForm = ref({ email: '', password: '' });
const registerForm = ref({ name: '', username: '', email: '', password: '' });

watch(() => props.modelValue, (newValue) => {
  dialogVisible.value = newValue;
  if (newValue) {
    tab.value = props.startTab;
  }
});

const closeDialog = () => {
  emit('update:modelValue', false);
};

const handleLogin = async () => {
  loading.value = true;
  try {
    const response = await api.post('/auth/login', loginForm.value);
    store.setToken(response.data.access_token);
    store.setUser(response.data.user);
    $q.notify({ color: 'positive', message: 'Login successful!' });
    closeDialog();
  } catch (error) {
    console.error('Login failed:', error); // The fix is here
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
    console.error('Registration failed:', error); // Also fixed here for consistency
    $q.notify({ color: 'negative', message: message });
  } finally {
    loading.value = false;
  }
};
</script>