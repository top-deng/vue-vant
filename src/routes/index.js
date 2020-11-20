/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
*/
export const constantRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home'),
    alias: ''
  }
]
