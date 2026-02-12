<template>
    <div class="backdrop" @click.self="$emit('close')">
        <div class="hud">
            <h3>Nuovo {{ tipo }}</h3>

            <div class="form">
                <!-- Per i PARCHI -->
                <template v-if="tipo === 'parco'">
                    <input v-model="form.nome" type="text" placeholder="Nome parco"/>

                    <select v-model="form.zona">
                        <option disabled value="">Seleziona una zona</option>
                        <option v-for="z in zone" :key="z" :value="z">{{ z }}</option>
                    </select>

                    <p>Clicca sulla mappa per scegliere la posizione del parco</p>

                    <textarea v-model="form.info" placeholder="Descrizione"></textarea>
                </template>

                <!-- Per gli INTERVENTI -->
                <template v-else-if="tipo === 'intervento'">
                    <select v-model="form.parco_id">
                        <option disabled value="">Seleziona un parco</option>
                        <option v-for="p in parchi" :key="p._id" :value="p._id">{{ p.nome }}</option>
                    </select>

                    <input v-model="form.data" type="date" />

                    <input v-model="form.responsabile" type="text"  placeholder="Responsabile"/>

                    <select v-model="form.tipologia">
                        <option disabled value="">Seleziona una tipologia</option>
                        <option v-for="t in tipologie" :key="t" :value="t">{{ t }}</option>
                    </select>

                    <textarea v-model="form.info" placeholder="Descrizione"></textarea>
                </template>

                <!-- Per le SEGNALAZIONI -->
                <template v-else>
                    <select v-model="form.parco_id">
                        <option disabled value="">Seleziona un parco</option>
                        <option v-for="p in parchi" :key="p._id" :value="p._id">{{ p.nome }}</option>
                    </select>

                    <textarea v-model="form.info" placeholder="Descrizione"></textarea>
                </template>

            </div>

            <div class="actions">
                <ButtonVue @click="send">Conferma</ButtonVue>
                <ButtonVue @click="$emit('close')">Chiudi</ButtonVue>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { reactive, watch } from 'vue'
    import ButtonVue from '../button.vue'

    const emit = defineEmits(['send', 'close'])

    const props = defineProps({
        tipo: {
            type: String,
            required: true
        },
        parchi: {
            type: Array,
            required: false
        },
        zone: {
            type: Array,
            required: false
        },
        tipologie: {
            type: Array,
            required: false
        },
        coords: {
            type: Object,
            required: false
        }
    })

    // ------------

    const form = reactive({
        nome: '',
        zona: '',
        info: '',
        lat: null,
        lng: null,

        parco_id: '',
        data: '',
        responsabile: '',
        tipologia: ''
    })

    function send(){
        emit('send', { ...form, tipo: props.tipo })

        Object.keys(form).forEach(k => form[k] = '')
    }

    watch(() => props.coords, (newCoords) => {
        form.lat = newCoords.lat
        form.lng = newCoords.lng
    })
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