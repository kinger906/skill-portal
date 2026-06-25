<template>
  <div v-if="skill">
    <div class="mb-6 flex justify-between items-start">
      <div>
        <NuxtLink to="/" class="text-cyan-400 hover:text-cyan-300 text-sm font-mono mb-4 inline-block">← Back</NuxtLink>
        <h1 class="text-3xl font-bold text-white mb-2">{{ skill.name }}</h1>
        <div class="flex gap-4 text-sm text-gray-500 font-mono">
          <span>Views: {{ skill.view_count }}</span>
          <span>Downloads: {{ skill.download_count }}</span>
        </div>
      </div>
      <a :href="`/api/skills/${skill.id}/download`" target="_blank" class="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-cyan-900/20 transition-all flex items-center gap-2">
        <span>Download Skill</span>
      </a>
    </div>
    
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-inner overflow-x-auto">
      <pre class="text-gray-300 font-mono text-sm whitespace-pre-wrap">{{ skill.content }}</pre>
    </div>
  </div>
</template>
<script setup>
const route = useRoute()
const { data: skill } = await useFetch(`/api/skills/${route.params.id}`)
</script>