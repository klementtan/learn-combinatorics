export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        exact: true,
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            exact: true,
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
            authority: ['ADMIN', 'PUBLIC_USER'],
            routes: [
                {
                  path: "/profile/",
                  name: "Profile",
                  icon: 'user',
                  exact: true,
                  component: './Profile'
              },
              {
                path: '/',
                exact: true,
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
                path: '/admin',
                name: 'admin',
                icon: 'crown',
                exact: true,
                authority: ['ADMIN'],
                routes: [
                  {
                    path: '/admin/users-manager',
                    name: 'users-manager',
                    icon: 'user',
                    exact: true,
                    component: './Admin/UsersManager/index.js',
                    authority: ['ADMIN'],
                  },
                  {
                    path: '/admin/chapters',
                    name: 'chapters',
                    icon: 'table',
                    component: './Admin/Chapters/index.js',
                    exact: true,
                    authority: ['ADMIN'],
                  },
                  {
                    path: '/admin/lectures',
                    name: 'lectures',
                    icon: 'table',
                    component: './Admin/Lectures/index.js',
                    exact: true,
                    authority: ['ADMIN'],
                  },
                  {
                    path: '/admin/problems',
                    name: 'problems',
                    icon: 'table',
                    component: './Admin/Problems/index.js',
                    exact: true,
                    authority: ['ADMIN'],
                  },
                  {
                    path: '/admin/hints',
                    name: 'hints',
                    icon: 'table',
                    component: './Admin/Hints/index.js',
                    exact: true,
                    authority: ['ADMIN'],
                  },
                  {
                    path: '/admin/attempts',
                    name: 'attempts',
                    icon: 'table',
                    component: './Admin/Attempts/index.js',
                    authority: ['ADMIN'],
                    exact: true,
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
                    exact: true,
                    component: './ProblemList',
                  },
                  {
                    path: '/problems/:problemId/attempt',
                    hideInMenu: true,
                    exact: true,
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
