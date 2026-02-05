<template>
  <div class="lista">

    <div class="header">
      <span v-for="(h, i) in headers" :key="i">
        {{ h }}
      </span>

      <span v-if="showCreate">
        <ButtonVue @click="$emit('create')">Crea Nuovo</ButtonVue>
      </span>
    </div>

    <Item
      v-for="item in items"
      :key="item._id"
      :item="item"
      :values="mapItem(item)"
      @select="$emit('select', item)"
    />
  </div>
</template>

<script setup>
  import Item from './item.vue'
  import ButtonVue from '../button.vue'

  const props = defineProps({
    items: {
      type: Array,
      required: true
    },
    headers: {
      type: Array,
      required: true
    },
    mapItem: {
      type: Function,
      required: true
    },
    showCreate: {
      type: Boolean,
      default: false
    }
  })

  defineEmits(['select', 'create'])
</script>

<style scoped>
  .lista {
    width: 95%;
  }
  .header {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr auto;
    padding: 10px;
    font-weight: 600;
    background: grey;
  }
</style>