import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import router from "./router";

const app = createApp(App);

app.config.globalProperties.scoreColors = [
  "red",
  "orange",
  "yellow",
  "lime",
  "green",
];

app.use(router);

app.mount("#app");
