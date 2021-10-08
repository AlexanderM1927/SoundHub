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
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'login', path: '', component: () => import('pages/Login.vue'), meta: { title: 'Login' } },
      { name: 'recovery', path: '/recovery', component: () => import('pages/Recovery.vue'), meta: { title: 'Recovery' } }
    ]
  },
  {
    path: '/profile',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'profile', path: '', props: { notmyprofile: false }, component: () => import('pages/Profile.vue'), meta: { title: 'Profile' } }
    ]
  },
  {
    path: '/profile/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'profile other', path: '', props: { notmyprofile: true }, component: () => import('pages/Profile.vue'), meta: { title: 'Profile' } }
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
    path: '/favoritos',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'Favoritos', path: '', component: () => import('pages/Favoritos.vue'), meta: { title: 'My Favorites', requireSession: true } }
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
    name: 'facebook',
    path: '/facebook/:token/:user',
    meta: {
      title: 'Login facebook'
    },
    props: route => ({ token: route.params.token, user: JSON.parse(route.params.user) })
  },
  {
    path: '/chat',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'chat', path: '', component: () => import('pages/Chat.vue'), meta: { title: 'My chats', requireSession: true } }
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
