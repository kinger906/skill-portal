<template>
  <div>
    <div class="mb-10 relative">
      <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <span class="text-gray-500">🔍</span>
      </div>
      <input v-model="search" type="text" placeholder="Search skills by name or description..." class="w-full bg-gray-900/80 border border-gray-800 rounded-xl py-4 pl-12 pr-4 text-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NuxtLink v-for="skill in skills" :key="skill.id" :to="`/skills/${skill.id}`" class="group block p-6 bg-gray-900 rounded-2xl border border-gray-800 hover:border-cyan-500/30 hover:bg-gray-800/80 transition-all duration-300">
        <h3 class="text-xl font-bold text-gray-100 group-hover:text-cyan-400 mb-2">{{ skill.name }}</h3>
        <p class="text-gray-400 text-sm line-clamp-2 mb-4">{{ skill.description }}</p>
        <div class="flex items-center text-xs text-gray-500 font-mono gap-4">
          <span>👁 {{ skill.view_count }}</span>
          <span>⬇ {{ skill.download_count }}</span>
        </div>
      </NuxtLink>
    </div>
    
    <div v-if="!skills?.length" class="text-center py-20 text-gray-500">
      No skills found.
    </div>
  </div>
</template>
<script setup>
const search = ref('')
const debouncedSearch = ref('')
let timeout
watch(search, (val) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => { debouncedSearch.value = val }, 300)
})

const { data: skills } = await useFetch('/api/skills', {
  query: { search: debouncedSearch }
})
</script>