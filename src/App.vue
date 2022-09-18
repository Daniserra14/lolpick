<script>
import PickerModal from "./components/pickerModal.vue";

export default {
  name: "App",
  data() {
    return {
      version: localStorage.getItem("version"),

      //champions
      rawChampionList: {},
      championScoreList: JSON.parse(
        localStorage.getItem("championScoreList") || "{}"
      ),

      //tags
      availableTags: [],
      selectedTag: null,

      // rating modal
      selectedChampionId: null,

      //search
      searchValue: "",

      //new version
      newVersion: false,
      newChampions: [],
    };
  },
  computed: {
    championList() {
      const championImgRoute = this.ddragonRoutes.championImg;
      let championList = Object.values(this.rawChampionList)
        .filter(
          (champion) =>
            this.selectedTag == null ||
            champion.tags.find((tag) => tag == this.selectedTag)
        )
        .map((champion) => {
          if (!this.championScoreList[champion.id]) {
            this.newChampions.push({
              name: champion.name,
              image: championImgRoute + champion.image.full,
            });

            this.updateChampionScore(champion.id, {
              top: 0,
              jungle: 0,
              mid: 0,
              bottom: 0,
              support: 0,
            });
          }

          return {
            id: champion.id,
            name: champion.name,
            image: championImgRoute + champion.image.full,
            tags: champion.tags,
            score: this.championScoreList[champion.id],
          };
        });

      if (this.searchValue != "") {
        championList = championList.filter((champion) =>
          champion.name.toLowerCase().includes(this.searchValue.toLowerCase())
        );
      }

      return championList;
    },
  },
  methods: {
    async fetchLastVersion() {
      const versionResponse = await fetch(this.ddragonRoutes.versions);
      const versions = await versionResponse.json();

      const version = versions[0];

      if (this.version != version) {
        this.newVersion = version;
        localStorage.setItem("version", version);
      } else {
        this.version = version;
      }

      // update ddragon routes with latest version
      Object.keys(this.ddragonRoutes).forEach((key) => {
        this.ddragonRoutes[key] = this.ddragonRoutes[key].replace(
          "{version}",
          version
        );
      });
    },
    async fetchChampionList() {
      const championsResponse = await fetch(this.ddragonRoutes.champions);
      const champions = (await championsResponse.json()).data;
      console.log("champions", champions);
      this.rawChampionList = champions;
    },
    composeCSSBgImg(image) {
      return `background-image: url('${image}')`;
    },
    updateChampionScore(champion, score) {
      this.championScoreList[champion] = score;

      localStorage.setItem(
        "championScoreList",
        JSON.stringify(this.championScoreList)
      );
    },
    getChampionBorderColorClass(champion) {
      let maxChampionScore = Math.max(...Object.values(champion.score));
      let color = this.scoreColors[maxChampionScore - 1];

      //border-red-600
      //border-orange-600
      //border-yellow-600
      //border-lime-600
      //border-green-600
      return color ? `border-${color}-600` : "";
    },
  },
  async created() {
    await this.fetchLastVersion();
    await this.fetchChampionList();
    // Create filter tags list
    Object.values(this.rawChampionList).forEach((champion) => {
      Object.values(champion.tags).forEach((tag) => {
        if (!this.availableTags.find((filterTag) => filterTag == tag)) {
          this.availableTags.push(tag);
        }
      });
    });
  },
  components: { PickerModal },
};
</script>

<template>
  <div class="container mx-auto dark:text-white">
    <h1 class="my-5 text-center text-3xl dark:text-amber-600">LolPick</h1>
    <div>
      <p v-if="newVersion && version">
        <span class="text-xl text-red-500">New version!</span>
        {{ version }} -> {{ newVersion }}
      </p>
      <p v-else>Version: {{ version || newVersion }}</p>
    </div>
    <div class="my-4" v-if="newChampions.length && version">
      <span v-if="newChampions.length == 1" class="text-xl text-red-500">
        New champion!
      </span>
      <span v-else class="text-xl text-red-500">New champions!</span>
      <div class="mt-2 flex flex-wrap gap-2">
        <div v-for="newChampion in newChampions" :key="newChampion">
          <img :src="newChampion.image" :alt="newChampion.name" />
          <span>{{ newChampion.name }}</span>
        </div>
      </div>
    </div>
    <form class="my-3 flex items-center">
      <label for="simple-search" class="sr-only">Search</label>
      <div class="relative w-full">
        <div
          class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
        >
          <svg
            aria-hidden="true"
            class="h-5 w-5 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          id="simple-search"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
          placeholder="Search"
          v-model="searchValue"
        />
        <button
          type="button"
          class="absolute inset-y-0 right-0 flex items-center pr-3"
          @click="searchValue = ''"
        >
          <svg
            class="h-6 w-6 text-gray-500 hover:text-gray-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </form>
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
    <div id="championList" class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-8">
      <div
        v-for="champion in championList"
        :key="champion.id"
        class="champion h-[120px] w-[120px] cursor-pointer bg-cover transition-all duration-300 hover:scale-110 hover:shadow-xl"
        :style="composeCSSBgImg(champion.image)"
        @click="selectedChampionId = champion.id"
      >
        <div
          class="flex h-full items-end justify-center border-4"
          :class="getChampionBorderColorClass(champion)"
        >
          <span class="w-full bg-black/60 text-center text-white">{{
            champion.name
          }}</span>
        </div>
      </div>
    </div>
    <PickerModal
      v-if="selectedChampionId"
      :championScore="championScoreList[selectedChampionId]"
      :championId="selectedChampionId"
      :championName="rawChampionList[selectedChampionId].name"
      @remove-selected-champion="selectedChampionId = null"
      @update-selected-champion-score="
        (score) => updateChampionScore(selectedChampionId, score)
      "
    />
  </div>
</template>
