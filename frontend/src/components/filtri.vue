<template>
    <div class="hud">
        <h3>Filtri</h3>
 
        <div class="filtro" v-for="type in types" :key="type.id">
            <input type="checkbox" :value="type.key" v-model="localTypes" :id="'filtro-' + type.id" />
            <label :for="'filtro-' + type.id">{{ type.name }}</label>
        </div>

        <div class="actions">
            <ButtonVue @click="reset">Reset</ButtonVue>
        </div>
    </div>
</template>


<script setup>
    import { watch, ref, computed } from 'vue'
    import ButtonVue from './button.vue'

    const props = defineProps({
        types: {
            type: Array,
            required: true
        },
        modelValue: {
            type: Array,
            default: () => []
        }
    })

    const emit = defineEmits(['update:modelValue'])

    const localTypes = computed({
        get: () => props.modelValue,
        set: (val) => emit('update:modelValue', val)
    })

    function reset(){
        localTypes.value = []
        emit('update:modelValue', [])
    }
</script>

<style scoped>
    .hud {
        background: grey;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 15px rgba(0,0,0,0.5);
        width: 100%;
        max-width: 250px;
        text-align: center;
    }

    /* Input e bottoni */
    .hud button {
        width: 100%;
        padding: 8px;
        margin-top: 5px;
    }

    .filtro {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }
    .filtro input[type="checkbox"] {
        margin-left: 10px;
        width: 16px;
        height: 16px;
    }
</style>
