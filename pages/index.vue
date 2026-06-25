<template>
  <div class="relative w-full">
    <!-- Hero Section -->
    <div class="pt-20 pb-12 text-center relative z-10 overflow-hidden">
      <!-- subtle background pattern -->
      <div class="absolute inset-0 z-[-1] opacity-30 pointer-events-none" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ff6a00\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      
      <h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Skills 让 AI 开发更简单</h1>
      <p class="text-slate-500 text-lg mb-10">懂你的 AI 技能库，帮你搞定一切</p>

      <!-- Search Bar -->
      <div class="max-w-3xl mx-auto px-4">
        <div class="flex items-center bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-2">
          <div class="hidden sm:flex items-center px-4 border-r border-slate-100">
            <select v-model="selectedCategory" class="bg-transparent text-slate-600 focus:outline-none cursor-pointer text-sm">
              <option value="">全部</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <input 
            v-model="search" 
            type="text" 
            placeholder="让 Skills 帮你找一个令人惊艳的 AI 能力..." 
            class="flex-1 bg-transparent px-4 md:px-6 py-3 text-slate-700 placeholder-slate-400 focus:outline-none w-full"
          />
          <button class="w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white shadow-md shadow-orange-500/30 transition-colors flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="max-w-7xl mx-auto px-6 pb-20">
      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NuxtLink 
          v-for="skill in skills" 
          :key="skill.id" 
          :to="`/skills/${skill.id}`" 
          class="group bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
        >
          <h3 class="text-lg font-bold text-slate-900 mb-3 group-hover:text-orange-500 transition-colors line-clamp-1">{{ skill.name }}</h3>
          <p class="text-slate-500 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">{{ skill.description }}</p>
          
          <!-- Footer -->
          <div class="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-50 mt-auto">
            <div class="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
              <span>{{ skill.categories?.[0]?.name || '默认分类' }}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="flex items-center gap-1 hover:text-orange-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                {{ skill.view_count }}
              </span>
              <span class="flex items-center gap-1 hover:text-orange-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                {{ skill.download_count }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
      
      <div v-if="!skills?.length" class="text-center py-20 text-slate-400">
        没有找到相关的能力，请尝试其他关键词。
      </div>
    </div>
  </div>
</template>

<script setup>
const search = ref('')
const debouncedSearch = ref('')
const selectedCategory = ref('')
let timeout

watch(search, (val) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => { debouncedSearch.value = val }, 300)
})

// Fetch categories
const { data: categories } = await useFetch('/api/categories')

// Fetch skills
const { data: skills } = await useFetch('/api/skills', {
  query: { 
    search: debouncedSearch,
    category: selectedCategory
  }
})
</script>