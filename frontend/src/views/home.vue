<template>
  <div class="home">
    <h1>Park Vision</h1>

    <div class="menu">
        <ButtonVue @click="loginOpen = true">Login</ButtonVue> <br> <br>
        <ButtonVue @click="signUpOpen = true">Registrati</ButtonVue>

        <LoginHUD v-if="loginOpen" @login="handleLogin" @close="loginOpen = false"/>
        <SignUpHUD v-if="signUpOpen" @signUp="handleSignUp" @close="signUpOpen = false"/>
    </div>
  </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import ButtonVue from '../components/button.vue'
    import LoginHUD from '../components/login.vue'
    import SignUpHUD from '../components/signUp.vue'
    import { register, login } from '../services/authService.js'

    const loginOpen = ref(false)
    const signUpOpen = ref(false)
    const router = useRouter()


    // ------------


    async function handleLogin({ username, password }){
        try {
            const res = await login({ username, password })

            if(!res || !res.token){
                alert('Nome utente o password non validi')
                return 
            }

            localStorage.setItem('jwt', res.token)
            localStorage.setItem('username', res.username)
            localStorage.setItem('ruolo', res.ruolo)

            loginOpen.value = false

            //Redirect in base al ruolo
            if(res.ruolo === 'operatore') router.push('/dashboard')
            else if(res.ruolo === 'utente') router.push('/public')

        } catch(err) { console.error(err) }
    }



    // ------------

    //Per verificare che la mail inserita sia valida
    function isValidEmail(email){
        const t = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return t.test(email)
    }

    //Uso una variabile loading perchè se no il bottone si preme due volte e manda l'alert (non ho voglia di risolvere in altro modo)
    const loading = ref(false)
    async function handleSignUp({ username, email, password }){
        if (loading.value) return

        //Controllo che tutti i campi siano compilati, e che la mail sia valida
        if(!username || !email || !password){
            alert('Campi non compilati')
            return
        }
        if(!isValidEmail(email)){
            alert('Email inserita non valida')
            return 
        }


        loading.value = true

        try {
            const utente = await register({ username, email, password })
        
            if(!utente){
                alert('Nome utente o Email non validi')
                loading.value = false
                return
            }


            //Chiamo il login quando la registrazione ha funzionato
            const loginRes = await login({ username, password })
            if(!loginRes || !loginRes.token){
                alert('Registrazione riuscita ma login fallito')
                loading.value = false
                return
            }

            //Salvo i token
            localStorage.setItem('jwt', loginRes.token)
            localStorage.setItem('username', loginRes.username)
            localStorage.setItem('ruolo', res.ruolo)


            router.push('/public') //Posso creare solo account base da qui, quindi il redirect è sempre alla parte pubblica
        } catch(err) { console.error(err) }

        loading.value = false
    }
</script>

<style scoped>
    .home {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 100px;
        font-family: sans-serif;
        text-align: center;
    }

    .home h1 {
        margin-bottom: 20px;
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
    }

    .menu {
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
</style>
