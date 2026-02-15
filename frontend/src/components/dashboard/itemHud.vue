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
                    <textarea v-model="form.responsabile" type="text" placeholder="Responsabile"></textarea>

                    <select v-model="form.tipologia">
                        <option disabled value="">Seleziona una tipologia</option>
                        <option v-for="t in tipologie" :key="t" :value="t">{{ t }}</option>
                    </select>

                    <textarea v-model="form.info" type="text" placeholder="Descrizione"></textarea>
                </template>
                
                <ButtonVue @click="conferma">Conferma</ButtonVue>
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

    const props = defineProps({
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
        },
        tipologie: {
            type: Array,
            required: false
        }
    })

    const form = reactive({
        nome: props.item.nome || '',
        info: props.item.info || '',
        dataPrevista: props.item.dataPrevista ? props.item.dataPrevista.split('T')[0] : null,
        responsabile: props.item.responsabile || '',
        tipologia: props.item.tipo || ''
    })

    const emit = defineEmits(['send', 'delete', 'close'])

    const modifica = ref(false)

    function changeHUD() {
        modifica.value = true
    }

    //Controllo che tutti i campi sono compliati e modifico l'oggetto
    function conferma(){
        if(props.tipo === 'parco' && !(form.nome && form.info)){
            alert('Campi non compilati')
            return
        }
        if(props.tipo === 'intervento' && !(form.info && form.dataPrevista !== null && form.responsabile && form.tipologia)){
            alert('Campi non compilati')
            return
        }

        emit('send', form)
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