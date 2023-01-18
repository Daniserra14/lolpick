<script>
export default {
  setup() {},
  props: {
    champion: {
      type: Object,
      required: true,
    },
    score: Number,
  },
  methods: {
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
  },
};
</script>
<template>
  <div
    class="flex h-full items-end justify-center border-4"
    :class="getChampionBorderColorClass(champion, score)"
  >
    <span class="w-full bg-black/60 text-center text-white">{{
      champion.name
    }}</span>
  </div>
</template>
