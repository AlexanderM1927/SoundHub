const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ],
    meta: {
      title: 'Home'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') },
      { path: '/recovery', component: () => import('pages/Recovery.vue') }
    ],
    meta: {
      title: 'Login'
    }
  },
  {
    path: '/perfil/:id',
    name: 'perfil',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ],
    meta: {
      title: 'Perfil', requireSession: true // this params is only in session routes
    }
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
