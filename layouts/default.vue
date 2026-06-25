<template>
  <div class="min-h-screen bg-gray-950 text-gray-200 font-sans selection:bg-cyan-900 selection:text-cyan-100">
    <header class="border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-50">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          SKILL<span class="text-white">PORTAL</span>
        </NuxtLink>
        <NuxtLink to="/admin" class="text-xs font-mono text-gray-500 hover:text-cyan-400 transition-colors">/admin</NuxtLink>
      </div>
    </header>
    <main class="max-w-5xl mx-auto px-6 py-8">
      <slot />
    </main>
  </div>
</template>