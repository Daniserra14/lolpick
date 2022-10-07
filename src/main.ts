import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import router from "./router";

const app = createApp(App);

app.config.globalProperties.ddragonRoutes = {
  versions: "https://ddragon.leagueoflegends.com/api/versions.json",
  champions:
    "https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/champion.json",
  championImg: "https://ddragon.leagueoflegends.com/cdn/{version}/img/champion/",
};

app.config.globalProperties.scoreColors = [
  "red",
  "orange",
  "yellow",
  "lime",
  "green",
];

app.use(router);

app.mount("#app");
