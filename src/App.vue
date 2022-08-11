<script>
export default {
  name: "App",
  data() {
    return {
      version: "12.12.1",
      rawChampionList: {},
      championScoreList: JSON.parse(
        localStorage.getItem("championScoreList") || "{}"
      ),
      availableTags: [],
      selectedTag: null,
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
          return {
            id: champion.id,
            name: champion.name,
            image: championImgRoute + champion.image.full,
            tags: champion.tags,
            score: this.championScoreList[champion.id] || 0,
          };
        });

      return championList;
    },
  },
  methods: {
    async fetchLastVersion() {
      console.log(this.ddragonRoutes.versions);
      const versionResponse = await fetch(this.ddragonRoutes.versions);
      const versions = await versionResponse.json();

      this.version = versions[0];

      // update ddragon routes with latest version
      Object.keys(this.ddragonRoutes).forEach((key) => {
        this.ddragonRoutes[key] = this.ddragonRoutes[key].replace(
          "{version}",
          versions[0]
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
};
</script>

<template>
  <div class="container mx-auto">
    <h1>LolPick</h1>
    <p>Version: {{ version }}</p>
    <div id="tags" class="flex justify-center gap-3">
      <button
        v-for="tag in availableTags"
        :key="tag"
        class="w-24 select-none rounded-full border border-black py-1 hover:bg-slate-100"
        :class="{ 'bg-orange-500 hover:bg-orange-500': selectedTag == tag }"
        @click="selectedTag = selectedTag != tag ? tag : null"
      >
        {{ tag }}
      </button>
    </div>
    <div id="championList" class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-8">
      <div
        v-for="champion in championList"
        :key="champion.id"
        class="champion h-[120px] w-[120px] cursor-pointer bg-cover transition-shadow duration-300 hover:shadow-lg"
        :style="composeCSSBgImg(champion.image)"
      >
        <div class="flex h-full items-end justify-center border-4">
          <span class="w-full bg-black/60 text-center text-white">{{
            champion.name
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
