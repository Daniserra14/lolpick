import { createWebHistory, createRouter } from "vue-router";

import Home from "@/views/Home.vue";
import Play from "@/views/Play.vue";
import Rate from "@/views/Rate.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/play",
    name: "Play",
    component: Play,
  },
  {
    path: "/rate",
    name: "Rate",
    component: Rate,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
