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

      // tags
      availableTags,
      selectedTag: null,
      showTags: false,

      // position
      selectedPosition: "top",

      // champions
      championScoreList,
      rawChampionList,

      championList: {},
    };
  },
  async created() {
    this.updateChampionList();
  },
  watch: {
    rawChampionList() {
      this.updateChampionList();
    },
    selectedPosition() {
      this.updateChampionList();
    },
    selectedTag() {
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
      return Object.values(this.championList).filter((champion) => {
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
    <div id="positions" class="mb-10 gap-3">
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
          @click="selectedPosition = position"
        >
          {{ position }}
        </button>
      </div>
    </div>
    <div id="tags" class="mb-7 gap-3">
      <div class="flex flex-wrap justify-center">
        <button
          type="button"
          class="mb-2 rounded-lg border border-amber-600 px-5 py-2.5 text-center text-sm font-medium text-amber-600 hover:bg-amber-600 hover:text-white dark:border-amber-500 dark:text-amber-500 dark:hover:bg-amber-600 dark:hover:text-white"
          :class="{
            'bg-amber-600 text-white dark:bg-amber-900 dark:text-white dark:hover:bg-amber-600':
              showTags || selectedTag != null,
          }"
          @click="showTags = !showTags"
        >
          Filter by tag
        </button>
      </div>
      <div v-show="showTags" class="flex flex-wrap justify-center gap-2">
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

    <div class="my-8">
      <div class="grid grid-flow-col grid-cols-6">
        <span class="col-span-1 text-center">Rating</span>
        <span class="col-span-5 text-center">Champions</span>
      </div>
      <div
        v-for="score in availableScores"
        :key="score"
        class="mt-4 border-t border-slate-400 pt-4"
      >
        <div class="grid grid-flow-col grid-cols-6">
          <div class="col-span-1 text-center relative">
            <span class="sticky top-5">
              Tier {{ score }}
            </span>
          </div>
          <div
            class="col-span-5 grid grid-cols-3 gap-4 px-6 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
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
    </div>
  </div>
</template>
