<script>
import { selectedChampionId } from '@/state/champions';

export default {
  setup() {},
  data() {
    return {
      selectedChampionId,
    };
  },
  props: {
    champion: {
      type: Object,
      required: true,
    },
    score: Number,
  },
  methods: {
    composeCSSBgImg(image) {
      return `background-image: url('${image}')`;
    },
    getChampionBorderColorClass(champion, score) {
      score =
        score !== undefined
          ? score
          : Math.max(...Object.values(champion.score));
      let color = this.scoreColors[score - 1];

      //border-red-600
      //border-orange-600
      //border-yellow-600
      //border-lime-600
      //border-green-600
      return color ? `border-${color}-600` : "";
    },
    selectChampion(championId) {
      selectedChampionId.value = championId;
    },
  },
};
</script>
<template>
  <article
    class="champion aspect-square w-full cursor-pointer bg-cover transition-all duration-300 hover:scale-110 hover:shadow-xl"
    :style="composeCSSBgImg(champion.image)"
  >
    <div
      class="flex h-full items-end justify-center border-4"
      :class="getChampionBorderColorClass(champion, score)"
      @click="selectChampion(champion.id)"
    >
      <span class="w-full bg-black/60 text-center text-white">{{
        champion.name
      }}</span>
    </div>
  </article>
</template>
