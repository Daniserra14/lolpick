<script>
import Search from "@/components/search.vue";
import Champion from "@/components/champion.vue";

import { lolVersion, oldLolVersion } from "@/state/lolVersion";
import {
  rawChampionList,
  championScoreList,
  getFormattedChampion,
  availableTags,
  selectedChampionId,
} from "@/state/champions";
import { ddragonRoutes } from "@/state/ddragonRoutes";
import PickerModal from "@/components/pickerModal.vue";

export default {
  name: "Home",
  data() {
    return {
      //champions
      rawChampionList,
      championScoreList,
      selectedChampionId,

      //tags
      availableTags,
      selectedTag: null,

      //search
      searchValue: "",

      newChampions: [],

      // lolVersion
      lolVersion,
      oldLolVersion,
    };
  },
  async created() {},
  computed: {
    showNewVersion() {
      return this.oldLolVersion && this.oldLolVersion != this.lolVersion;
    },
    championList() {
      const championImgRoute = ddragonRoutes.championImg;

      let championList = Object.values(rawChampionList.value)
        .filter(
          (champion) =>
            this.selectedTag == null ||
            champion.tags.find((tag) => tag == this.selectedTag)
        )
        .map((champion) => {
          if (!championScoreList.value[champion.id]) {
            this.newChampions.push({
              name: champion.name,
              image: championImgRoute + champion.image.full,
            });

            // this.updateChampionScore(champion.id, {
            //   top: 0,
            //   jungle: 0,
            //   mid: 0,
            //   bottom: 0,
            //   support: 0,
            // });
          }

          return getFormattedChampion(champion);
        });

      if (this.searchValue != "") {
        championList = championList.filter((champion) =>
          champion.name.toLowerCase().includes(this.searchValue.toLowerCase())
        );
      }

      return championList;
    },
  },
  methods: {
    composeCSSBgImg(image) {
      return `background-image: url('${image}')`;
    },
    // updateChampionScore(champion, score) {
    //   championScoreList.value[champion] = score;

    //   localStorage.setItem(
    //     "championScoreList",
    //     JSON.stringify(championScoreList.value)
    //   );
    // },
    setSearch(value) {
      this.searchValue = value;
    },
  },
  components: { Search, Champion, PickerModal },
};
</script>

<template>
  <section class="text-center">
    <h1
      class="my-5 text-center text-3xl font-bold text-amber-800 dark:text-amber-600"
    >
      LolPick
    </h1>
    <div>
      <p v-if="showNewVersion">
        <span class="text-xl text-red-500">New version!</span>
        {{ oldLolVersion }} -> {{ lolVersion }}
      </p>
      <p v-else>Version: {{ lolVersion }}</p>
    </div>
    <div class="my-4" v-if="showNewVersion && newChampions.length">
      <span v-if="newChampions.length == 1" class="text-xl text-red-500">
        New champion!
      </span>
      <span v-else class="text-xl text-red-500">New champions!</span>
      <div class="mt-2 flex flex-wrap gap-2">
        <div v-for="newChampion in newChampions" :key="newChampion">
          <img :src="newChampion.image" :alt="newChampion.name" />
          <span>{{ newChampion.name }}</span>
        </div>
      </div>
    </div>
  </section>
  <Search @search="setSearch" />
  <div id="tags" class="flex flex-wrap justify-center gap-3 px-2">
    <button
      v-for="tag in availableTags"
      :key="tag"
      class="w-24 select-none rounded-full border border-black py-1 hover:bg-slate-100 dark:hover:bg-neutral-600"
      :class="{
        'bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-600':
          selectedTag == tag,
      }"
      @click="selectedTag = selectedTag != tag ? tag : null"
    >
      {{ tag }}
    </button>
  </div>
  <div
    id="championList"
    class="my-4 grid grid-cols-3 gap-4 px-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
  >
      <Champion
        v-for="champion in championList"
        :key="champion.id"
        :champion="champion"
      />
    </div>
  <div v-if="championList.length == 0" class="mt-32">
    <p class="text-center text-3xl">Who the **** is that!?</p>
  </div>
  <PickerModal
      v-if="selectedChampionId"
      :selectedChampionId="selectedChampionId"
      @remove-selected-champion="selectedChampionId = null"
    />
</template>
