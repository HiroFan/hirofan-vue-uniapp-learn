<script setup>
defineOptions({ name: 'UserCard' })

const props = defineProps({
  user: {
    type: Object,
    required: true,
    validator: (val) => val && typeof val.name === 'string'
  }
})

const emit = defineEmits(['edit'])

const editName = () => {
  const name = prompt('新名字', props.user.name)
  if (name) emit('edit', 'name', name)
}
const editAge = () => {
  const age = Number(prompt('新年龄', props.user.age))
  if (age && age > 0 && age < 150) emit('edit', 'age', age)
}
</script>

<template>
  <div class="user-card">
    <div class="avatar">{{ user.avatar }}</div>
    <div class="info">
      <div class="name">{{ user.name }}</div>
      <div class="meta">{{ user.age }} 岁 · ID: U00{{ user.age }}</div>
    </div>
    <div class="actions">
      <button class="btn-sm" @click="editName">改名字</button>
      <button class="btn-sm ghost" @click="editAge">改年龄</button>
    </div>
  </div>
</template>

<style scoped>
.user-card { display: flex; align-items: center; gap: 14px; background: #f9fafb; border: 1px solid #ebeef5; border-radius: 10px; padding: 16px; }
.avatar { width: 48px; height: 48px; border-radius: 50%; background: #42b883; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 24px; }
.info { flex: 1; }
.name { font-size: 16px; font-weight: 600; color: #1a1a1a; }
.meta { font-size: 12px; color: #909399; margin-top: 2px; }
.actions { display: flex; gap: 6px; }
.btn-sm { padding: 5px 12px; border: none; border-radius: 5px; background: #42b883; color: #fff; font-size: 12px; cursor: pointer; }
.btn-sm:hover { background: #359a6b; }
.btn-sm.ghost { background: #fff; border: 1px solid #dcdfe6; color: #606266; }
.btn-sm.ghost:hover { border-color: #42b883; color: #42b883; }
</style>