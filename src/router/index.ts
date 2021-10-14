import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
// import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/table",
    name: "table",
    component: () =>
      import(/* webpackChunkName: "table" */ "../views/Table.vue"),
  },
  {
    path: "/table2",
    // name: "table2",
    component: () =>
      import( "../views/Table2.vue"),
  },
  {
    path: "/table3",
    component: () =>
      import( "../views/Table3.vue"),
  },
  {
    path: "/table4",
    // name: "table2",
    component: () =>
      import( "../views/Table4.vue"),
  },
  {
    path: "/table5",
    // name: "table2",
    component: () =>
      import( "../views/Table5.vue"),
  },
  {
    path: "/table6",
    component: () =>
      import( "../views/Table6.vue"),
  },
  {
    path: "/scroll",
    component: () =>
      import( "../views/VirtualScroll.vue"),
  },
];

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory(),
  routes,
});

export default router;
