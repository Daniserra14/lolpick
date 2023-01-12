<script>
import PickerModal from "@/components/pickerModal.vue";
import Search from "@/components/search.vue";
import Champion from "@/components/champion.vue";

import { fetchChampionList, fetchLastVersion } from "@/services/fetch";

import lolVersion from "@/state/lolVersion";

export default {
  name: "Home",
  data() {
    return {
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
    setSearch(value) {
      this.searchValue = value;
    },
  },
  async created() {
    const version = await fetchLastVersion(this.ddragonRoutes.versions);

    if (this.version != version) {
      this.newVersion = version;
      localStorage.setItem("version", version);
      lolVersion.value = version;
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

    this.rawChampionList = await fetchChampionList(
      this.ddragonRoutes.champions
    );
    // Create filter tags list
    Object.values(this.rawChampionList).forEach((champion) => {
      Object.values(champion.tags).forEach((tag) => {
        if (!this.availableTags.find((filterTag) => filterTag == tag)) {
          this.availableTags.push(tag);
        }
      });
    });
  },
  components: { PickerModal, Search, Champion },
};
</script>

<template>
  <section class="text-center">
    <h1
      class="my-5 text-center text-3xl font-bold text-amber-800 dark:text-amber-600"
    >
      LolPick
    </h1>
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
  </section>
  <Search @search="setSearch" />
  <div id="tags" class="flex flex-wrap justify-center gap-3 px-2">
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
  <div
    id="championList"
    class="my-4 grid grid-cols-3 gap-4 px-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
  >
    <div
      v-for="champion in championList"
      :key="champion.id"
      class="champion aspect-square w-full cursor-pointer bg-cover transition-all duration-300 hover:scale-110 hover:shadow-xl"
      :style="composeCSSBgImg(champion.image)"
      @click="selectedChampionId = champion.id"
    >
      <Champion :champion="champion" />
    </div>
  </div>
  <div v-if="championList.length == 0" class="mt-32">
    <p class="text-center text-3xl">Who the **** is that!?</p>
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
</template>
