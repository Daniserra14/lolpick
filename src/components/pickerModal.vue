<script>
import { updateChampionScore, getFormattedChampion, rawChampionList } from "@/state/champions";

export default {
  data() {
    return {
      newChampionScore: this.championScore,
      formattedChampion: null,
      isRatePage: this.$router.currentRoute.value.path == "/rate",

      // scoreColors:
      // bg-red-200 bg-red-600
      // bg-orange-200 bg-orange-600
      // bg-yellow-200 bg-yellow-600
      // bg-lime-200 bg-lime-600
      // bg-green-200 bg-green-600
    };
  },
  beforeMount() {
    this.updateFormatedChampion()
  },
  mounted() {
    // focus on dialog
    this.$refs.dialog.focus();
  },
  watch: {
    selectedChampionId: {
      handler() {
        this.updateFormatedChampion()
      },
    },
  },
  props: {
    selectedChampionId: {
      type: String,
      required: true,
    },
  },
  methods: {
    updateFormatedChampion() {
      const champion = rawChampionList.value[this.selectedChampionId];
      this.formattedChampion = getFormattedChampion(champion);
    },
    updateCurrentChampionScore(position, positionScore) {
      this.formattedChampion.score[position] = positionScore;
      updateChampionScore(this.formattedChampion.id, this.formattedChampion.score);
    },
    closeModal() {
      this.$emit("removeSelectedChampion");
    },
    selectRandomChampion() {
      this.$emit("selectRandomChampion");
    },
  },
};
</script>
<style lang="scss">
.modal-wrapper {
  position: fixed;

  .modal {
    width: 600px;
    max-width: 90%;
    height: 500px;
    background: #fff;
    color: #000;
  }
}
</style>
<template>
  <Transition>
    <div
      id="defaultModal"
      tabindex="-1"
      aria-hidden="true"
      class="h-modal fixed top-0 right-0 left-0 z-50 w-full overflow-y-auto overflow-x-hidden md:inset-0 h-full bg-black bg-opacity-50"
      @click.self="closeModal()"
      @keydown.escape="closeModal()"
      ref="dialog"
    >
      <div class="relative m-auto h-full w-full max-w-2xl p-4 md:h-auto" @click.self="closeModal()">
        <div
          class="relative rounded-lg bg-white bg-contain shadow dark:border-2 dark:border-slate-500 dark:bg-slate-900"
        >
          <div
          :style="{ backgroundImage: `url(${formattedChampion.fullBodyImage}), url(${formattedChampion.image})`}"
            class="absolute inset-0 bg-cover bg-center rounded-lg opacity-20 blur"
          ></div>
          <div
            class="flex items-start justify-between rounded-t border-b py-4 px-6 dark:border-gray-600 relative"
          >
            <img :src="formattedChampion.image" :alt="formattedChampion.name" class="aspect-square w-8 mr-2">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ formattedChampion.name }}
            </h3>
            <button
              type="button"
              class="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="defaultModal"
              @click="closeModal()"
            >
              <svg
                aria-hidden="true"
                class="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <div class="space-y-6 m-6 relative">
            <div
              class="score-position"
              :key="position"
              v-for="position in Object.keys(formattedChampion.score)"
            >
              <p class="mb-2 text-black dark:text-white">{{ position }}</p>
              <div class="grid grid-cols-5 gap-2">
                <button
                  v-for="(color, index) in scoreColors"
                  :key="index"
                  :class="
                    (formattedChampion.score[position] == index + 1
                      ? `bg-${color}-600`
                      : `bg-${color}-200`) + ` hover:bg-${color}-600`
                  "
                  class="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-bold text-black hover:shadow dark:hover:shadow-gray-300"
                  @click="updateCurrentChampionScore(position, index + 1)"
                >
                  {{ index + 1 }}
                </button>
              </div>
            </div>
          </div>
          <div v-if="isRatePage" class="m-6 text-right relative">
            <button 
              @click="selectRandomChampion()"
              class="rounded-lg border border-gray-200 mt-3 px-3 py-2 text-sm"
            >
              Random champion
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
