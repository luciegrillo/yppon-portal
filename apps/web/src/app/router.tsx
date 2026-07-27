import { createBrowserRouter, type RouteObject } from 'react-router';
import { PORTAL_ROUTES } from '../config/routes';
import { RootErrorBoundary } from './RootErrorBoundary';
import { RootLayout } from './RootLayout';

export const portalRoutes: RouteObject[] = [
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: RootErrorBoundary,
    children: [
      {
        index: true,
        lazy: async () => {
          const { HomePage } = await import('../pages/home/HomePage');

          return { Component: HomePage };
        },
      },
      {
        path: PORTAL_ROUTES.iugy,
        lazy: async () => {
          const { IugyPage } = await import('../pages/iugy/IugyPage');

          return { Component: IugyPage };
        },
      },
      {
        path: '*',
        lazy: async () => {
          const { NotFoundPage } = await import('../pages/not-found/NotFoundPage');

          return { Component: NotFoundPage };
        },
      },
    ],
  },
];

export const router = createBrowserRouter(portalRoutes);
