<script>
import { lolVersion } from "@/state/lolVersion.js";

import {
  availableTags,
  championScoreList,
  rawChampionList,
  getFormattedChampion,
} from "@/state/champions";

import Champion from "@/components/champion.vue";

export default {
  data() {
    return {
      lolVersion,
      availableTags,
      selectedTag: null,

      // position
      selectedPosition: "top",

      // champions
      championScoreList,
      rawChampionList,

      championList: {},
    };
  },
  beforeMount() {
    this.updateChampionList();
  },
  watch: {
    selectedPosition() {
      this.updateChampionList();
    },
  },
  computed: {
    availableScores() {
      return [6, 5, 4, 3, 2, 1, 0].filter((score) => {
        return this.getChampionsByScore(score).length;
      });
    },
  },
  methods: {
    composeCSSBgImg(image) {
      return `background-image: url('${image}')`;
    },
    getChampionsByScore(score) {
      return this.championList.filter((champion) => {
        return champion.score[this.selectedPosition] == score;
      });
    },
    updateChampionList() {
      const champions = Object.values(rawChampionList.value)
        .filter((champion) => {
          return (
            this.selectedTag == null ||
            champion.tags.some((tag) => tag == this.selectedTag)
          );
        })
        .map((champion) => {
          champion = getFormattedChampion(champion);

          return champion;
        });

      // let championsByScore = {
      //   6: [],
      //   5: [],
      //   4: [],
      //   3: [],
      //   2: [],
      //   1: [],
      //   0: [],
      // };

      // champions.forEach((champion) => {
      //   championsByScore[champion.score[this.selectedPosition]].push(champion);
      // });

      // this.championsByScore = championsByScore;
      this.championList = champions;
    },
  },
  components: { Champion },
};
</script>
<template>
  <div>
    {{ lolVersion }}
    <div id="tags" class="mb-4 gap-3 px-2">
      <p class="mb-3 text-center capitalize">Tags</p>
      <div class="flex flex-wrap justify-center gap-2">
        <button
          v-for="tag in availableTags"
          :key="tag"
          class="w-24 select-none justify-center rounded-full border border-black py-1 hover:bg-slate-100 dark:hover:bg-neutral-600"
          :class="{
            'bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-600':
              selectedTag == tag,
          }"
          @click="selectedTag = selectedTag != tag ? tag : null"
        >
          {{ tag }}
        </button>
      </div>
    </div>
    <div id="positions" class="mb-4 gap-3 px-2">
      <p class="mb-3 text-center capitalize">Position</p>
      <div class="flex flex-wrap justify-center gap-2">
        <button
          v-for="position in ['top', 'jungle', 'mid', 'bottom', 'support']"
          :key="position"
          class="w-24 select-none rounded-full border border-black py-1 capitalize hover:bg-slate-100 dark:hover:bg-neutral-600"
          :class="{
            'bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-600':
              selectedPosition == position,
          }"
          @click="
            selectedPosition = selectedPosition != position ? position : null
          "
        >
          {{ position }}
        </button>
      </div>
    </div>
    <div class="my-4 px-2">
      <div
        v-for="score in availableScores"
        :key="score"
        class="border-b-1 mb-4 grid grid-cols-3 gap-4 px-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
      >
        <div
          v-for="champion in getChampionsByScore(score)"
          :key="champion.id"
          class="aspect-square w-full cursor-pointer bg-cover transition-all duration-300 hover:scale-110 hover:shadow-xl"
          :style="composeCSSBgImg(champion.image)"
        >
          <Champion :champion="champion" :score="score" />
        </div>
      </div>
    </div>
  </div>
</template>
