<script>
export default {
  data() {
    return {
      //TODO: Make it a computed property
      newChampionScore: this.championScore,
    };
  },
  props: {
    championScore: Object,
    championId: String,
    championName: String,
  },
  methods: {
    updateCurrentChampionScore(position, positionScore) {
      this.newChampionScore[position] = positionScore;

      this.$emit("updateSelectedChampionScore", this.newChampionScore);
    },
    closeModal() {
      this.$emit("removeSelectedChampion");
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
    <!-- <div class="modal-wrapper">
      <div class="modal">{{ championScore }}</div>
    </div> -->
    <div
      id="defaultModal"
      tabindex="-1"
      aria-hidden="true"
      class="h-modal fixed top-0 right-0 left-0 z-50 w-full overflow-y-auto overflow-x-hidden md:inset-0 md:h-full"
    >
      <div class="relative m-auto h-full w-full max-w-2xl p-4 md:h-auto">
        <!-- Modal content -->
        <div
          class="relative rounded-lg bg-white shadow dark:border-2 dark:border-slate-500 dark:bg-slate-900"
        >
          <!-- Modal header -->
          <div
            class="flex items-start justify-between rounded-t border-b py-4 px-6 dark:border-gray-600"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ championName }}
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
          <!-- Modal body -->
          <div class="space-y-6 p-6">
            <div
              class="score-position"
              :key="position"
              v-for="position in Object.keys(championScore)"
            >
              <p class="mb-2 text-white">{{ position }}</p>
              <div class="grid grid-cols-5 gap-2">
                <button
                  v-for="(color, index) in scoreColors"
                  :key="index"
                  :class="
                    (championScore[position] == index + 1
                      ? `bg-${color}-600`
                      : `bg-${color}-200`) + ` hover:bg-${color}-600`
                  "
                  class="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-bold text-black"
                  @click="updateCurrentChampionScore(position, index + 1)"
                >
                  {{ index + 1 }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
