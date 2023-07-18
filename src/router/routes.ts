import { RouteConfig } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import multiguard from 'vue-router-multiguard';
import { NavigationGuardNext, Route } from 'vue-router';

const estaLogeado = (to: Route, from: Route, next: NavigationGuardNext) => {
  const appStore = useAuthStore();
  if (appStore.estaLogeado === false) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath },
    });
  }
  return next();
};

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        beforeEnter: multiguard([estaLogeado]),
      },
    ],
  },

  {
    path: '/cambiar_clave/:ruc',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/CambiarClavePage.vue') },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
