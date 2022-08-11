import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";

const app = createApp(App);

app.config.globalProperties.ddragonRoutes = {
  versions: "https://ddragon.leagueoflegends.com/api/versions.json",
  champions:
    "http://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/champion.json",
  championImg: "http://ddragon.leagueoflegends.com/cdn/{version}/img/champion/",
};

app.mount("#app");
