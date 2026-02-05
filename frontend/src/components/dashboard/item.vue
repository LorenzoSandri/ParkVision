<template>
  <div class="item">
    <span v-for="(value, i) in values" :key="i">
      {{ value }}
    </span> 

    <ButtonVue class="icon-btn" @click="$emit('select', item)">+</ButtonVue>
  </div>
</template>

<script setup>
  import ButtonVue from '../button.vue'

  //Item è l'oggetto (parco, segnalazione o intervento), values sono i valori (parco.nome, nSegnalazioni, nInterventi, ...)
  defineProps({
    item: {
      type: Object,
      required: true
    },
    values: {
      type: Array,
      required: true
    }

  })

  defineEmits(['select'])
</script>

<style scoped>
  .item {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr auto;
    align-items: center;

    width: 100%;
    padding: 10px;
    border-bottom: 1px solid grey;
  }

  .icon-btn {
    width: 32px;
    height: 32px;

    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 30px;
    font-weight: bold;
  }
</style>