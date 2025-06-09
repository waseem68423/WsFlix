<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="text-h4 q-mb-md">Create New Product</div>
    <q-card flat bordered>
      <q-form @submit.prevent="handleSubmit" class="q-gutter-y-md q-pa-md">
        <div class="text-h6">Product Information</div>
        <q-input filled v-model="form.name" label="Product Name *" :rules="[ val => !!val || 'Name is required']" />
        <q-input filled v-model="form.description" label="Product Description *" type="textarea" autogrow :rules="[ val => !!val || 'Description is required']" />
        <div class="text-h6 q-mt-lg">Product Image</div>
        <q-file filled v-model="imageFile" label="Select an image *" accept="image/*" @update:model-value="handleImageSelect" :rules="[val => !!val || 'An image is required']">
          <template v-slot:prepend><q-icon name="attach_file" /></template>
        </q-file>
        <q-img v-if="imageUrl" :src="imageUrl" class="q-mt-sm" style="height: 200px; max-width: 200px; border-radius: 4px; border: 1px solid #ddd" fit="contain" />
        <div class="text-h6 q-mt-lg">Details</div>

        <!-- --- THIS IS THE UPDATED LINE --- -->
        <q-select filled v-model="form.category" :options="['Clothes', 'Electronics', 'Books', 'Home Goods']" label="Category *" :rules="[ val => !!val || 'Category is required']" />
        <!-- --- END OF UPDATE --- -->

        <q-input filled type="number" v-model.number="form.price" label="Price ($) *" prefix="$" :rules="[ val => val > 0 || 'Price must be greater than 0']" />
        <q-input filled type="number" v-model.number="form.quantity" label="Quantity in Stock *" :rules="[ val => val >= 0 || 'Quantity cannot be negative']" />
        <div class="row justify-end q-mt-lg">
          <q-btn label="Reset" type="reset" color="grey" flat class="q-mr-sm" @click="resetForm" />
          <q-btn label="Add Product" type="submit" color="primary" unelevated size="lg" icon="add_circle" :loading="isSubmitting" />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar'; // Import useQuasar
import { api } from 'boot/axios';

const $q = useQuasar();
const router = useRouter();
const isSubmitting = ref(false);
const initialFormState = () => ({ name: '', description: '', category: null, price: null, quantity: null });
const form = ref(initialFormState());
const imageFile = ref(null);
const imageUrl = ref(null);
const imageDataUrlToSend = ref(null);

const handleImageSelect = (file) => {
  if (!file) {
    imageUrl.value = null;
    imageDataUrlToSend.value = null;
    return;
  }
  imageUrl.value = URL.createObjectURL(file);
  const reader = new FileReader();
  reader.onload = (e) => { imageDataUrlToSend.value = e.target.result; };
  reader.readAsDataURL(file);
};

const resetForm = () => {
  form.value = initialFormState();
  imageFile.value = null;
  imageUrl.value = null;
  imageDataUrlToSend.value = null;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  // This version of the component seems to be sending the image as a base64 string
  // which is different from the FormData method. Ensure the backend can handle this.
  const payload = { ...form.value, imageDataUrl: imageDataUrlToSend.value };
  try {
    await api.post('/products', payload);
    $q.notify({ color: 'positive', message: 'Product created successfully!', icon: 'check_circle' });
    router.push('/');
  } catch (error) {
    console.error('Failed to add product:', error);
    $q.notify({ color: 'negative', message: 'Failed to add product. Please check the console.', icon: 'error' });
  } finally {
    isSubmitting.value = false;
  }
};
</script>