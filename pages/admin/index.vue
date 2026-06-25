<template>
  <div>
    <div class="flex justify-between mb-6">
      <h2 class="text-2xl font-bold">Skills Management</h2>
      <button @click="showForm = true" class="bg-cyan-600 px-4 py-2 rounded text-sm">Add Skill</button>
    </div>
    
    <div v-if="showForm" class="bg-gray-800 p-6 rounded-lg mb-6 border border-gray-700">
      <h3 class="text-xl mb-4">New Skill</h3>
      <textarea v-model="form.content" rows="10" class="w-full bg-gray-900 border border-gray-600 rounded p-4 text-gray-200 font-mono text-sm mb-4" placeholder="# Skill Name\n<description>...</description>\n\nPrompt content..."></textarea>
      <div class="flex gap-2">
        <button @click="submit" class="bg-cyan-600 px-4 py-2 rounded">Save</button>
        <button @click="showForm = false" class="bg-gray-600 px-4 py-2 rounded">Cancel</button>
      </div>
    </div>

    <div class="grid gap-4">
      <div v-for="skill in skills" :key="skill.id" class="bg-gray-800 p-4 rounded border border-gray-700 flex justify-between">
        <div>
          <h4 class="font-bold text-cyan-300">{{ skill.name }}</h4>
          <p class="text-sm text-gray-400">{{ skill.description }}</p>
        </div>
        <button @click="deleteSkill(skill.id)" class="text-red-400 hover:text-red-300 text-sm">Delete</button>
      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { data: skills, refresh } = await useFetch('/api/skills')
const showForm = ref(false)
const form = ref({ content: '' })

const submit = async () => {
  await $fetch('/api/skills', { method: 'POST', body: form.value })
  showForm.value = false
  form.value.content = ''
  refresh()
}
const deleteSkill = async (id) => {
  if (confirm('Are you sure?')) {
    await $fetch(`/api/skills/${id}`, { method: 'DELETE' })
    refresh()
  }
}
</script>