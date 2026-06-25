<template>
  <div class="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
    <header class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-2xl font-black tracking-tight text-slate-900">SKILLS</span>
        </NuxtLink>
        <div class="flex items-center gap-4">
          <NuxtLink to="/admin" class="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            管理 / 登录
          </NuxtLink>
        </div>
      </div>
    </header>
    <main class="min-h-[calc(100vh-64px)] relative">
      <slot />
    </main>
  </div>
</template>