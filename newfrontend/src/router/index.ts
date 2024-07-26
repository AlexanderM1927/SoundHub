import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import ('../pages/index.vue')
        },
        {
            path: '/search/:name',
            name: 'Search',
            component: () => import ('../pages/search.vue')
        },
    ]
})