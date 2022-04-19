import {
    createRouter,
    createWebHashHistory
} from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'list',
        component: () => import('@/views/list.vue') // 懒加载组件
    },
    {
        path: '/cart',
        name: 'cart',
        component: () => import('@/views/cart.vue') // 懒加载组件
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router