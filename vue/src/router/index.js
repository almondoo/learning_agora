import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/Home.vue'
import Agora from '../pages/Agora.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/agora',
      name: 'agora',
      component: Agora
    }
  ]
})
