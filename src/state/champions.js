import { ref } from "vue";

export const rawChampionList = ref({});

export let championScoreList = ref({});

export function updateChampionScore(championId, score) {
  championScoreList.value[championId] = score;

  localStorage.setItem(
    "championScoreList",
    JSON.stringify(championScoreList.value)
  );
}

export const availableTags = ref([]);
