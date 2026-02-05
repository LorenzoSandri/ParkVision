<template>
    <div class="backdrop" @click.self="$emit('close')">
        <div class="hud">
            <h3>{{ tipo === 'parco' ? item.nome : 'Intervento su ' + nomeParco }}</h3>


            <div v-if="modifica" class="modify-form">
                <!-- PARCO -->
                <template v-if="tipo === 'parco'">
                    <input v-model="form.nome" type="text" placeholder="Nome parco"/>
                    <textarea v-model="form.info" placeholder="Descrizione"></textarea>
                </template>

                <!-- INTERVENTO -->
                <template v-else-if="tipo === 'intervento'">
                    <input v-model="form.dataPrevista" type="Date"/>
                    <textarea v-model="form.rinnovo" type="Number" placeholder="Rinnovo"></textarea>
                </template>
                
                <ButtonVue @click="$emit('send', form)">Conferma</ButtonVue>
            </div>

            <div v-else class="actions">
                <ButtonVue @click="changeHUD">Modifica {{ tipo === 'parco' ? 'Parco' : 'Intervento' }}</ButtonVue>
                <ButtonVue @click="$emit('delete')">Elimina</ButtonVue>
            </div>


            <ButtonVue @click="$emit('close')">Chiudi</ButtonVue>
        </div>
    </div>
</template>

<script setup>
    import { reactive, ref } from 'vue'
    import ButtonVue from '../button.vue'

    defineProps({
        tipo: {
            type: String, // 'parco' o 'intervento'
            required: true
        },
        item: {
            type: Object,
            required: true
        },
        nomeParco: {
            type: String,
            required: false
        }
    })

    const form = reactive({
        nome: '',
        info: '',
        dataPrevista: null,
        rinnovo: -1
    })

    const emit = defineEmits(['send', 'delete', 'close'])

    const modifica = ref(false)

    function changeHUD() {
        modifica.value = true
    }
</script>

<style scoped>
    .hud {
        position: fixed;
        background: grey;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 15px rgba(0,0,0,0.5);
        z-index: 2000;
        text-align: center;
    }

    .hud button {
        width: 100%;
        padding: 8px;
        margin-top: 5px;
    }

    .backdrop {
        position: fixed;
        display: flex;
        right: 0;
        height: 100%;
        width: 31.1%;
        background: rgba(0, 0, 0, 0.4);
        z-index: 1999;
        align-items: center;
        justify-content: center;
    }
</style>