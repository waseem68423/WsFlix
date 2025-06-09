<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Your Shopping Cart</div>
    <div v-if="store.cart.length === 0" class="text-center text-grey q-mt-xl">
      <q-icon name="remove_shopping_cart" size="5em" />
      <p class="q-mt-md text-h6">Your cart is currently empty.</p>
      <q-btn to="/" color="primary" label="Continue Shopping" unelevated />
    </div>
    <div v-else>
      <q-list bordered separator>
        <q-item v-for="item in store.cart" :key="item.id" class="q-py-md">
          <q-item-section avatar><q-img :src="`http://localhost:3000${item.imageUrl}`" width="100px" fit="contain" /></q-item-section>
          <q-item-section><q-item-label class="text-weight-bold">{{ item.name }}</q-item-label><q-item-label caption>${{ item.price }} / unit</q-item-label></q-item-section>
          <q-item-section><q-input dense outlined type="number" :model-value="item.quantity" @update:model-value="val => store.updateQuantity(item.id, parseInt(val, 10))" style="width: 80px" :min="0" /></q-item-section>
          <q-item-section side><div class="text-h6 text-weight-medium">${{ (item.price * item.quantity).toFixed(2) }}</div></q-item-section>
          <q-item-section side><q-btn flat round color="negative" icon="delete_forever" @click="store.removeFromCart(item.id)" /></q-item-section>
        </q-item>
      </q-list>
      <div class="row justify-end q-mt-lg"><div class="col-auto"><div class="text-h5 text-weight-bold">Total: ${{ store.cartTotal.value }}</div><div class="text-caption text-grey">Shipping is free!</div></div></div>
      <div class="row justify-end q-mt-md"><q-btn to="/checkout" color="primary" size="lg" label="Proceed to Checkout" unelevated :disable="store.cart.length === 0" /></div>
    </div>
  </q-page>
</template>
<script setup>
import { store } from 'src/store/store';
</script>