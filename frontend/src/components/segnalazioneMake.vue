<template>
    <div class="backdrop" @click.self="$emit('close')">
        <div class="hud">
            <h3>Segnalazione</h3>

            <select v-model="parco">
                <option disabled value="">Seleziona un parco</option>
                <option v-for="p in parchi" :key="p._id" :value="p.nome">
                    {{ p.nome }}
                </option>
            </select>
            
            <input v-model="info" type="text" placeholder="Descrizione"/>

            <div class="actions">
                <ButtonVue @click="send">Invia</ButtonVue>
                <ButtonVue @click="$emit('close')">Chiudi</ButtonVue>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import ButtonVue from './button.vue'

    const parco = ref('')
    const info = ref('')

    const props = defineProps({
        utente: {
            type: String,
            required: true
        },
        parchi: {
            type: Array,
            required: true
        }
    })

    const emit = defineEmits(['send', 'close'])

    function send() {
        //Trovo il parco giusto per avere l'ID
        const parcoSelezionato = props.parchi.find(p => p.nome === parco.value)

        if(!parcoSelezionato || !info.value.trim()){ //Per bloccare l'invio quando i campi non sono inviati
            alert('Campi non compilati')
            return
        }
        emit('send', {
            parco_id: parcoSelezionato._id,
            data: new Date(),
            stato: false,
            info: info.value,
            utente: props.utente
        })

        parco.value = ''
        info.value = ''
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
        z-index: 2000;
        width: 250px;
        text-align: center;
    }

    /* Input e bottoni */
    .hud input {
        display: block;
        width: 90%;
        margin: 10px auto;
        padding: 8px;
    }

    .hud button {
        width: 100%;
        padding: 8px;
        margin-top: 5px;
    }

    .backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 1999;
    }
</style>