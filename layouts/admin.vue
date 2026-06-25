<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col">
    <header class="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
      <h1 class="text-xl font-bold text-cyan-400">Admin Portal</h1>
      <button @click="logout" class="text-sm text-gray-400 hover:text-white">Logout</button>
    </header>
    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>
<script setup>
const logout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  navigateTo('/admin/login')
}
</script>