<template>
    <div class="backdrop" @click.self="$emit('close')">
        <div class="hud">
            <h3>Filtri per {{ tipo }}</h3>

            <!-- PARCHI -->
            <template v-if="tipo === 'parchi'">
                <label>
                    <input type="checkbox" v-model="localTypes.segnalazioni"/>
                    Parchi con segnalazioni attive
                </label>
                <label>
                    <input type="checkbox" v-model="localTypes.interventi"/>
                    Parchi con interventi programmati
                </label>

                <div class="titolo-gruppo">Zona</div>
                <div class="checkbox-list">
                    <label v-for="z in zone" :key="z">
                        <input type="checkbox" :value="z" v-model="localTypes.zona"/>
                        {{ z }}
                    </label>
                </div>
            </template>

            <!-- SEGNALAZIONI -->
            <template v-else-if="tipo === 'segnalazioni'">
                <div class="titolo-gruppo">Parco</div>
                <div class="checkbox-list">
                    <label v-for="p in parchi" :key="p._id">
                        <input type="checkbox" :value="p._id" v-model="localTypes.parco_id"/>
                        {{ p.nome }}
                    </label>
                </div>

                <div class="titolo-gruppo">Zona</div>
                <div class="checkbox-list">
                    <label v-for="z in zone" :key="z">
                        <input type="checkbox" :value="z" v-model="localTypes.zona"/>
                        {{ z }}
                    </label>
                </div>
            </template>

            <!-- INTERVENTI -->
            <template v-else-if="tipo === 'interventi'">
                <div class="titolo-gruppo">Parco</div>
                <div class="checkbox-list">
                    <label v-for="p in parchi" :key="p._id">
                        <input type="checkbox" :value="p._id" v-model="localTypes.parco_id"/>
                        {{ p.nome }}
                    </label>
                </div>

                <div class="titolo-gruppo">Zona</div>
                <div class="checkbox-list">
                    <label v-for="z in zone" :key="z">
                        <input type="checkbox" :value="z" v-model="localTypes.zona"/>
                        {{ z }}
                    </label>
                </div>

                <div class="titolo-gruppo">Responsabile</div>
                <div class="checkbox-list">
                    <label v-for="r in responsabili" :key="r">
                        <input type="checkbox" :value="r" v-model="localTypes.responsabile"/>
                        {{ r }}
                    </label>
                </div>

                <div class="titolo-gruppo">Tipologia</div>
                <div class="checkbox-list">
                    <label v-for="t in tipologie" :key="t">
                        <input type="checkbox" :value="t" v-model="localTypes.tipo"/>
                        {{ t }}
                    </label>
                </div>
            </template>
            
            <div class="actions">
                <ButtonVue @click="reset">Reset</ButtonVue>
                <ButtonVue @click="$emit('close')">Chiudi</ButtonVue>
            </div>
        </div>
    </div>
</template>


<script setup>
    import { watch, reactive } from 'vue'
    import ButtonVue from '../button.vue'

    const props = defineProps({
        tipo: { // 'parchi' | 'segnalazioni' | 'interventi'
            type: String,
            required: true
        },
        modelValue: { //Filtri specifici per il tipo (filtri.tipo)
            type: Object,
            required: true
        },
        zone: {
            type: Array,
            default: () => []
        },
        parchi: {
            type: Array,
            default: () => []
        },
        responsabili: {
            type: Array,
            default: () => []
        },
        tipologie: {
            type: Array,
            default: () => []
        }
    })

    const emit = defineEmits(['update:modelValue', 'close'])

    const localTypes = reactive({...props.modelValue})

    //Questo watch aggiorna i filtri locali quando cambiano quelli della view
    watch( () => props.modelValue, (newVal) => {
        localTypes.value = {...newVal}
    })
    //Questo aggiorna quello della view quando cambiano quelli locali
    watch(localTypes, (newVal) => {
        emit('update:modelValue', newVal)
    })

    

    function reset() {
        const temp = {}

        for(const key in props.modelValue){
            const val = props.modelValue[key]
            if (Array.isArray(val)) temp[key] = []
            else if (typeof val === 'boolean') temp[key] = false
            else temp[key] = null
        }

        for(const k in localTypes) delete localTypes[k]
        Object.assign(localTypes, temp)

        emit('update:modelValue', JSON.parse(JSON.stringify(localTypes)))
    }
</script>

<style scoped>
    .hud {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: grey;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 15px rgba(0,0,0,0.5);
        width: 100%;
        max-width: 250px;
        text-align: center;
        max-height: 80vh;
        overflow-y: auto;
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
    .backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 1999;
    }

    .checkbox-list {
        border: 1px solid #ddd;
        border-radius: 6px;
        padding: 10px;
        margin-bottom: 16px;
    }
    .checkbox-list label {
        display: flex;
        align-items: center;
        margin-bottom: 6px;
    }
    .titolo-gruppo {
        margin: 12px 0 6px;
        font-weight: 600;
        font-size: 1.2rem;
        color: white;
        text-align: center;
    }
</style>