<script>
import Champion from "@/components/champion.vue";
import PickerModal from "@/components/pickerModal.vue";
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
      handleSelectRandomChampion() {
        const unratedChampions = this.unratedChampions;
        
        if (unratedChampions.length === 0) {
          return null;
        }

        const championIds = unratedChampions.map((champion) => champion.id);
        const nextChampionId = championIds[Math.floor(Math.random() * championIds.length)];

        this.selectedChampionId = nextChampionId;
      },
    },
    computed: {
      unratedChampions() {
        return getUnratedChampions();
      },
    },
    components: { Champion, PickerModal }
};
</script>
<template>
  <h1 class="text-center text-xl my-8">Unrated champions</h1>
  <div class="my-4 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
    <Champion v-for="champion in unratedChampions" :key="champion.id" :champion="champion" />
  </div>
  <PickerModal
      v-if="selectedChampionId"
      :selectedChampionId="selectedChampionId"
      @remove-selected-champion="selectedChampionId = null"
      @select-random-champion="handleSelectRandomChampion()"
    />
</template>
