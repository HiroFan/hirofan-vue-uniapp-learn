<script setup>
defineOptions({ name: 'CounterCard' })

const props = defineProps({
  step: { type: Number, default: 1 },
  min: { type: Number, default: -Infinity },
  max: { type: Number, default: Infinity }
})

const emit = defineEmits(['change'])
const model = defineModel({ type: Number, default: 0 })

const inc = () => {
  if (model.value < props.max) {
    model.value += props.step
    emit('change', model.value)
  }
}
const dec = () => {
  if (model.value > props.min) {
    model.value -= props.step
    emit('change', model.value)
  }
}
const reset = () => {
  model.value = 0
  emit('change', 0)
}
</script>

<template>
  <div class="counter">
    <button class="btn-round" @click="dec">−</button>
    <div class="num">{{ model }}</div>
    <button class="btn-round" @click="inc">+</button>
    <button class="btn-reset" @click="reset">重置</button>
  </div>
</template>

<style scoped>
.counter { display: flex; align-items: center; gap: 12px; padding: 12px; background: #f9fafb; border: 1px solid #ebeef5; border-radius: 10px; }
.btn-round { width: 40px; height: 40px; border-radius: 50%; border: none; background: #42b883; color: #fff; font-size: 22px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.btn-round:hover { background: #359a6b; }
.num { font-size: 28px; font-weight: 700; color: #1a1a1a; min-width: 40px; text-align: center; font-family: Consolas, monospace; }
.btn-reset { padding: 6px 14px; border: 1px solid #dcdfe6; border-radius: 6px; background: #fff; color: #606266; font-size: 12px; cursor: pointer; margin-left: auto; }
.btn-reset:hover { border-color: #42b883; color: #42b883; }
.range-hint { font-size: 11px; color: #909399; text-align: center; margin-top: 6px; font-family: Consolas, monospace; }
</style>