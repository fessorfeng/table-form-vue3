import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
// import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () =>
      import(/* webpackChunkName: "table-form" */ "../views/table-form.vue"),
  },
  {
    path: "/select",
    component: () =>
      import( "../views/select-demo.vue"),
  },
  {
    path: "/scroll",
    component: () =>
      import( "../views/VirtualScroll.vue"),
  },
  {
    path: "/scroll2",
    component: () =>
      import( "../views/scroll2.vue"),
  },
];

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory(),
  routes,
});

export default router;
