<script>
export default {
  data() {
    return {
      //champions
      rawChampionList: {},
      championScoreList: JSON.parse(
        localStorage.getItem("championScoreList") || "{}"
      ),
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
};
</script>
<template>
  <h1>Rate Page</h1>
</template>
