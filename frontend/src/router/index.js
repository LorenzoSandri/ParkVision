import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home.vue'
import Public from '../views/public.vue'
import Dashboard from '../views/dashboard.vue'
import Docs from '../views/docs.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/public', name: 'Public', component: Public, meta: { requiresAuth: true } },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true, ruolo: 'operatore' } },
  { path: '/docs', name: 'Docs', component: Docs }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


//Blocco l'accesso alle pagine agli utenti non loggati
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt')

  //Se non ho il token torno alla home
  if(to.meta.requiresAuth && !token) return next('/')
  
  //Se sto accedendo alla dashboard ma non sono operatore
  if(to.meta.ruolo === 'operatore'){
    const ruolo = localStorage.getItem('ruolo')
    if(ruolo !== 'operatore') return next('/public')
  }


  next()
})

export default router
