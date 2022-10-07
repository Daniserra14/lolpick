<script>
import { lolpick } from "@/state/lolpick";

export default {
  data() {
    return {
      version: lolpick.version,
    };
  },
};
</script>
<template>
  <div>
    {{ version }}
    <div id="tags" class="flex justify-center gap-3">
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
  </div>
</template>
