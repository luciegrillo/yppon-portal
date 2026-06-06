import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './RootLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        lazy: async () => {
          const { HomePage } = await import('../pages/home/HomePage');

          return { Component: HomePage };
        },
      },
      {
        path: 'iugy',
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
]);
