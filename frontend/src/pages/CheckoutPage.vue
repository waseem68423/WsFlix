<template>
  <q-page class="q-pa-lg">
    <div class="text-h4">Checkout</div>
    <div class="text-subtitle1 text-grey">Confirm your order (Cash on Delivery)</div>
    <q-separator class="q-my-md" />
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-7">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Delivery Information</div>
          </q-card-section>
          <q-card-section>
            <q-form @submit.prevent="placeOrder" class="q-gutter-md">
              <q-input filled v-model="form.customerName" label="Full Name" :rules="[val => !!val || 'Name is required']" />
              <q-input filled v-model="form.customerPhone" label="Phone Number" mask="(###) ### - ####" :rules="[val => !!val || 'Phone is required']" />
              <q-input filled v-model="form.deliveryAddress" label="Full Street Address, City, Postal Code" type="textarea" :rules="[val => !!val || 'Address is required']" />
              <q-btn type="submit" color="primary" label="Place Order" class="full-width" size="lg" unelevated :loading="isSubmitting" />
            </q-form>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-5">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Order Summary</div>
          </q-card-section>
          <q-list separator>
            <q-item v-for="item in store.cart" :key="item.id">
              <q-item-section>
                <q-item-label>{{ item.name }}</q-item-label>
                <q-item-label caption>Qty: {{ item.quantity }}</q-item-label>
              </q-item-section>
              <q-item-section side top>${{ (item.price * item.quantity).toFixed(2) }}</q-item-section>
            </q-item>
          </q-list>
          <q-separator />
          <q-card-section class="text-right">
            <div class="text-h5">Total: ${{ store.cartTotal.value }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { store } from 'src/store/store';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();
const isSubmitting = ref(false);
const form = ref({ customerName: '', customerPhone: '', deliveryAddress: '' });

onMounted(() => {
  if (store.user) {
    form.value.customerName = store.user.name;
  }
});

const placeOrder = async () => {
  isSubmitting.value = true;
  try {
    const orderPayload = {
      ...form.value,
      items: store.cart.map(item => ({ productId: item.id, quantity: item.quantity })),
    };
    await api.post('/orders', orderPayload);
    store.clearCart();
    router.push({ name: 'OrderSuccess' });
  } catch (error) {
    console.error('Could not place order:', error);
    $q.notify({ color: 'negative', message: 'Could not place order.' });
  } finally {
    isSubmitting.value = false;
  }
};
</script>