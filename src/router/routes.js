
const routes = [
  {//page login
    path: '/login',
    component: () => import('pages/auth/Login.vue')
  },
  {//page signup
    path: '/signup',
    component: () => import('pages/auth/Signup.vue')
  },
  {//page reset password
    path: '/reset-password',
    component: () => import('pages/auth/ResetPassword.vue')
  },
  {//page password change
    path: '/password-change',
    component: () => import('pages/auth/PasswordChange.vue')
  },
  {//page dashboard
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/dashboard/Index.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
