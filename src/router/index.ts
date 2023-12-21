import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

export const Layout = () => import("@/layout/index.vue");

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },

  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },

  {
    path: "/",
    name: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard", // 用于 keep-alive, 必须与SFC自动推导或者显示声明的组件name一致
        // https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
        meta: {
          title: "dashboard",
          icon: "homepage",
          affix: true,
          keepAlive: true,
          alwaysShow: false,
        },
      },
      {
        path: "401",
        component: () => import("@/views/error-page/401.vue"),
        meta: { hidden: true },
      },
      {
        path: "404",
        component: () => import("@/views/error-page/404.vue"),
        meta: { hidden: true },
      },
    ],
  },

  // 外部链接
  // {
  //   path: "/external-link",
  //   component: Layout,
  //   children: [ {
  //       component: () => import("@/views/external-link/index.vue"),
  //       path: "https://www.cnblogs.com/haoxianrui/",
  //       meta: { title: "外部链接", icon: "link" },
  //     },
  //   ],
  // },
// 资源管理
//   {
//     path : '/assetmag',
//     component : Layout,
//     name : 'Assetmag',
//     meta : { title : '资源管理', icon : 'client' },
//     children : [
//       {
//         path : '/assetmag/pipelinemanagement',
//         component : () => import( '@/views/assetmag/Pipelinemanagement/index.vue' ),
//         name : 'Pipelinemanagement',
//         meta : { title : '传感器管理', noCache : true }
//       },
//       {
//         path : '/assetmag/sensormanagement',
//         component : () => import( '@/views/assetmag/sensormanagement/index.vue' ),
//         name : 'Sensormanagement',
//         meta : { title : '管道管理', noCache : true }
//       }
//     ]
//   },
//   // 项目管理
//   {
//     path : '/item',
//     component : Layout,
//     name : 'Item',
//     meta : { title : '项目管理', icon : 'document' },
//     children : [
//       {
//         path : '/item',
//         component : () => import( '@/views/item/index.vue' ),
//         name : 'itemmag',
//         meta : { title : '项目管理', noCache : true }
//       }
//     ]
//   },
//   // 模型管理
//   {
//     path : '/model',
//     component : Layout,
//     name : 'Model',
//     meta : { title : '模型管理', icon : 'tree' },
//     children : [
//       {
//         path : '/model/tunnel',
//         component : () => import( '@/views/model/tunnel/index.vue' ),
//         name : 'Tunnel',
//         meta : { title : '传感器模型管理', noCache : true }
//       },
//       {
//         path : '/model/sensor',
//         component : () => import( '@/views/model/sensor/index.vue' ),
//         name : 'Sensor',
//         meta : { title : '工业管道模型管理', noCache : true }
//       }
//     ]
//   },
//   // 管道信息监测管理
//   {
//     path : '/monitor',
//     component : Layout,
//     name : 'Monitor',
//     meta : { title : '管道信息监测管理', icon : 'homepage' },
//     children : [
//       {
//         path : '/monitor/Historycallog',
//         component : () => import( '@/views/monitor/Historycallog.vue' ),
//         name : 'Historycallog',
//         meta : { title : '历史监测信息', noCache : true }
//       },
//       {
//         path : '/monitor/newlog',
//         component : () => import( '@/views/monitor/newlogTwo.vue' ),
//         name : 'Newlog',
//         meta : { title : '实时监测信息', noCache : true }
//       }
//     ]
//   },
//   // 报警管理
//   {
//     path : '/alarm',
//     component : Layout,
//     name : 'Alarm',
//     meta : { title : '报警管理', icon : 'security' },
//     children : [
//       {
//         path : '/alarm/allalarm',
//         component : () => import( '@/views/alarm/allalarm/index.vue' ),
//         name : 'allalarm',
//         meta : { title : '全部报警', noCache : true }
//       },
//       {
//         path : '/alarm/overalarm',
//         component : () => import( '@/views/alarm/overalarm/index.vue' ),
//         name : 'overalarm',
//         meta : { title : '已处理报警', noCache : true }
//       },
//       {
//         path : '/alarm/noalarm',
//         component : () => import( '@/views/alarm/noalarm/index.vue' ),
//         name : 'noalarm',
//         meta : { title : '未处理报警', noCache : true }
//       }
//     ]
//   },
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: "/login" });
}

export default router;
