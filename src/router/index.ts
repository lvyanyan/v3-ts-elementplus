import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: () => import('../views/home.vue'),
            children: [
                { path: '/systemManagement/userManagement', component: () => import('../views/systemManagement/userManagement.vue') },
                { path: '/systemManagement/authorizationManagement', component: () => import('../views/systemManagement/authorizationManagement.vue') },
                { path: '/systemManagement/dataDictionary', component: () => import('../views/systemManagement/dataDictionary.vue') },
                { path: '/systemManagement/logManagement', component: () => import('../views/systemManagement/logManagement.vue') },
                { path: '/systemManagement/menuManagement', component: () => import('../views/systemManagement/menuManagement.vue') },
                { path: '/informManagement', component: () => import('../views/informManagement/index.vue') },
                { path: '/reportManagement', component: () => import('../views/reportManagement/index.vue') },
                { path: '/serviceManagement', component: () => import('../views/serviceManagement/index.vue') },
                { path: '/synchronizationManagement', component: () => import('../views/synchronizationManagement/index.vue') },
            ]
        },
        {
            path: '/login',
            component: () => import('../views/login/index.vue')
        },
    ]
})
export default router