<template>
  <div v-if="skill" class="max-w-7xl mx-auto py-10">
    <div class="mb-8">
      <NuxtLink to="/" class="text-slate-400 hover:text-orange-500 text-sm font-medium mb-6 inline-flex items-center gap-1 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        返回列表
      </NuxtLink>
      
      <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">{{ skill.name }}</h1>
          <div class="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span class="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              {{ skill.view_count }} 浏览
            </span>
            <span class="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              {{ skill.download_count }} 下载
            </span>
            <span class="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              发布于 {{ new Date(skill.created_at).toLocaleDateString() }}
            </span>
          </div>
        </div>
        
        <a :href="`/api/skills/${skill.id}/download`" target="_blank" class="shrink-0 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>下载 Skill</span>
        </a>
      </div>
    </div>
    
    <div class="bg-white border border-slate-100 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-x-auto">
      <div class="prose prose-slate max-w-none">
        <pre class="bg-slate-50 text-slate-800 p-6 rounded-xl font-mono text-sm whitespace-pre-wrap border border-slate-100">{{ skill.content }}</pre>
      </div>
    </div>
  </div>
</template>
<script setup>
const route = useRoute()
const { data: skill } = await useFetch(`/api/skills/${route.params.id}`)
</script>