<script>
import Champion from "@/components/champion.vue";
import { getUnratedChampions } from "@/state/champions";
import { championScoreList, rawChampionList, selectedChampionId } from "@/state/champions";

export default {
    data() {
        return {
            championScoreList,
            rawChampionList,
            selectedChampionId,
            // unratedChampions: {},
        };
    },
    methods: {
      // setUnratedChampions() {
      //   const champions = Object.values(this.rawChampionList)
      //                           .map((champion) => getFormattedChampion(champion))
      //                           .filter((champion) => {
      //                             return Object.values(this.championScoreList[champion.id]).every((value) => value === 0);
      //                           });

      //   this.unratedChampions = champions;
      // },
    },
    computed: {
      unratedChampions() {
        return getUnratedChampions();
      },
    },
    components: { Champion }
};
</script>
<template>
  <h1>Unrated champions:</h1>
  <div class="my-4 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
    <Champion v-for="champion in unratedChampions" :key="champion.id" :champion="champion" />
  </div>
</template>
