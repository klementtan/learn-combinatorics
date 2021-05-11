export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/dashboard',
              },
              {
                path: '/dashboard',
                name: 'dashboard',
                exact: true,
                icon: 'AreaChartOutlined',
                component: './Dashboard'
              },
              {
                path: '/user-profile',
                name: 'profile',
                icon: 'user',
                component: './Profile',
              },
              {
                path: '/admin',
                name: 'admin',
                icon: 'crown',
                authority: ['ADMIN'],
                routes: [
                  {
                    path: '/admin/users-manager',
                    name: 'users-manager',
                    icon: 'user',
                    component: './Admin/UsersManager/index.js',
                    authority: ['ADMIN'],
                  },
                  {
                    path: '/admin/chapters',
                    name: 'chapters',
                    icon: 'table',
                    component: './Admin/Chapters/index.js',
                    authority: ['ADMIN'],
                  },
                  {
                    path: '/admin/lectures',
                    name: 'lectures',
                    icon: 'table',
                    component: './Admin/Lectures/index.js',
                    authority: ['ADMIN'],
                  },
                  {
                    path: '/admin/problems',
                    name: 'problems',
                    icon: 'table',
                    component: './Admin/Problems/index.js',
                    authority: ['ADMIN'],
                  },
                  {
                    path: '/admin/hints',
                    name: 'hints',
                    icon: 'table',
                    component: './Admin/Hints/index.js',
                    authority: ['ADMIN'],
                  },
                  {
                    path: '/admin/attempts',
                    name: 'attempts',
                    icon: 'table',
                    component: './Admin/Attempts/index.js',
                    authority: ['ADMIN'],
                  },
                ],
              },
              {
                name: 'Problems',
                routes: [
                  {
                    path: '/problems/list',
                    name: 'All',
                    icon: 'table',
                    component: './ProblemList',
                  },
                  {
                    path: '/problems/:problemId/attempt',
                    hideInMenu: true,
                    component: './ProblemAttempt',
                  },
                ],
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
