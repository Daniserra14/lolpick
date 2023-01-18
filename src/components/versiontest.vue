<script>
import { lolVersion, oldLolVersion } from "@/state/lolVersion";

import championScoreList from "@/state/champions";

export default {
  data() {
    return {
      lolVersion,
      oldLolVersion,
      championScoreList,
    };
  },
};
</script>
<template>
  <div>
    <button class="bg-red-200 p-2 text-black" @click="lolVersion = '14'">
      {{ lolVersion }}
    </button>
    <p>Old: {{ oldLolVersion }}</p>
    <p>championScoreList: {{ championScoreList }}</p>
  </div>
</template>
