<script>
import { fetchLastVersion, fetchChampionList } from "@/services/fetch";

import { lolVersion, oldLolVersion } from "@/state/lolVersion";
import {
  rawChampionList,
  championScoreList,
  updateChampionScore,
  availableTags,
  selectedChampionId
} from "@/state/champions";
import { ddragonRoutes } from "@/state/ddragonRoutes";
import PickerModal from "./components/pickerModal.vue";

export default {
    data() {
        return {
            selectedChampionId,
            isDarkMode: document.documentElement.classList.contains("dark"),
            championScoreList,
            rawChampionList,
            navLinks: [
                {
                    url: "/",
                    name: "Home",
                },
                {
                    url: "/play",
                    name: "Play",
                },
                // {
                //   url: "/rate",
                //   name: "Rate",
                // },
            ],
        };
    },
    async beforeCreate() {
        if (localStorage.getItem("color-theme") === "dark" ||
            (!("color-theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            document.documentElement.classList.add("dark");
        }
        else {
            document.documentElement.classList.remove("dark");
        }
        // get version
        const version = await fetchLastVersion(ddragonRoutes.versions);
        oldLolVersion.value = localStorage.getItem("version");
        lolVersion.value = version;
        if (lolVersion != oldLolVersion) {
            localStorage.setItem("version", lolVersion.value);
        }
        // update ddragon routes with latest version
        Object.keys(ddragonRoutes).forEach((key) => {
            ddragonRoutes[key] = ddragonRoutes[key].replace("{version}", version);
        });
        rawChampionList.value = await fetchChampionList(ddragonRoutes.champions);
        // champion score list
        championScoreList.value = JSON.parse(localStorage.getItem("championScoreList") || "{}");
        Object.values(rawChampionList.value).forEach((champion) => {
            if (!championScoreList.value[champion.id]) {
                // this.newChampions.push({
                //   name: champion.name,
                //   image: ddragonRoutes.championImg + champion.image.full,
                // });
                updateChampionScore(champion.id, {
                    top: 0,
                    jungle: 0,
                    mid: 0,
                    bottom: 0,
                    support: 0,
                });
            }
            // available tags
            Object.values(champion.tags).forEach((tag) => {
                if (!availableTags.value.find((filterTag) => filterTag == tag)) {
                    availableTags.value.push(tag);
                }
            });
        });
    },
    methods: {
        setDarkMode(isDarkMode) {
            this.isDarkMode = isDarkMode;
            if (isDarkMode) {
                document.documentElement.classList.add("dark");
                localStorage.setItem("color-theme", "dark");
            }
            else {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("color-theme", "light");
            }
        },
    },
    components: { PickerModal }
};
</script>
<template>
  <div class="container mx-auto min-h-screen dark:text-white px-2">
    <div id="nav" class="flex gap-2 py-4 dark:text-white">
      <router-link
        v-for="navLink in navLinks"
        :key="navLink"
        class="box-content w-12 rounded-lg border-b border-slate-700 p-2 text-center shadow-sm transition-all duration-300 hover:bg-slate-200 dark:hover:bg-slate-700 dark:border-slate-700 dark:hover:border-slate-700"
        active-class="shadow-black dark:shadow-indigo-300"
        :to="navLink.url"
        >{{ navLink.name }}
      </router-link>
      <button
        @click="setDarkMode(!isDarkMode)"
        id="theme-toggle"
        type="button"
        class="ml-auto rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
      >
        <svg
          v-if="!isDarkMode"
          id="theme-toggle-dark-icon"
          class="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
          ></path>
        </svg>
        <svg
          v-else
          id="theme-toggle-light-icon"
          class="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            fill-rule="evenodd"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
    <router-view />
    <PickerModal
      v-if="selectedChampionId"
      :championScore="championScoreList[selectedChampionId]"
      :championId="selectedChampionId"
      :championName="rawChampionList[selectedChampionId].name"
      @remove-selected-champion="selectedChampionId = null"
    />
  </div>
</template>
