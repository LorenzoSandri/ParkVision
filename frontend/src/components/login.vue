<template>
    <div class="backdrop" @click.self="$emit('close')">
        <div class="hud">
            <h3>Login</h3>

            <input v-model="username" type="text" placeholder="Nome Utente"/>
            <input v-model="password" type="password" placeholder="Password"/>

            <div class="actions">
                <ButtonVue @click="login">Accedi</ButtonVue>
                <ButtonVue @click="$emit('close')">Chiudi</ButtonVue>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import ButtonVue from './button.vue'

    const username = ref('')
    const password = ref('')

    const emit = defineEmits(['login', 'close'])

    function login() {
        emit('login', {
            username: username.value,
            password: password.value
        })
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