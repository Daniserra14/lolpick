import { ref } from "vue";
import { ddragonRoutes } from "./ddragonRoutes";

export const rawChampionList = ref({});

export let championScoreList = ref({});

export function updateChampionScore(championId, score) {
  championScoreList.value[championId] = score;

  localStorage.setItem(
    "championScoreList",
    JSON.stringify(championScoreList.value)
  );
}

export function getFormattedChampion(champion) {
  return {
    id: champion.id,
    name: champion.name,
    image: ddragonRoutes.championImg + champion.image.full,
    tags: champion.tags,
    score: championScoreList.value[champion.id],
  };
}

export const availableTags = ref([]);
