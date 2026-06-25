<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center">
    <div class="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 w-96">
      <h2 class="text-2xl font-bold text-center text-cyan-400 mb-6">Admin Login</h2>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <input v-model="password" type="password" placeholder="Password" class="w-full bg-gray-900 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-cyan-400" />
        </div>
        <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
        <button type="submit" class="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded transition">Login</button>
      </form>
    </div>
  </div>
</template>
<script setup>
definePageMeta({ layout: false })
const password = ref('')
const error = ref('')
const login = async () => {
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: { password: password.value } })
    navigateTo('/admin')
  } catch (e) {
    error.value = 'Invalid password'
  }
}
</script>