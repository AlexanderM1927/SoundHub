const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'home', path: '', component: () => import('pages/Index.vue'), meta: { title: 'SoundHub' } }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { name: 'login', path: '', component: () => import('pages/Login.vue'), meta: { title: 'Login' } },
      { name: 'recovery', path: '/recovery', component: () => import('pages/Recovery.vue'), meta: { title: 'Recovery' } }
    ]
  },
  {
    path: '/perfil/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'perfil', path: '', component: () => import('pages/Index.vue'), meta: { title: 'Profile' } }
    ]
  },
  {
    path: '/search/:name',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'search', path: '', component: () => import('pages/Search.vue'), meta: { title: 'Search' } }
    ]
  },
  {
    path: '/sound',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'sound', path: '', component: () => import('pages/Sound.vue'), meta: { title: 'My songs' } }
    ]
  },
  {
    path: '/playlist',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'playlist', path: '', component: () => import('pages/Playlist.vue'), meta: { title: 'My playlists', requireSession: true } }
    ]
  },
  {
    path: '/playlist/:playlist_id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'playlist-profile', path: '', component: () => import('pages/PlaylistProfile.vue'), meta: { title: 'Playlist' } }
    ]
  },
  {
    name: 'logout',
    path: '/logout',
    meta: {
      title: 'Logout', requireSession: true
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
