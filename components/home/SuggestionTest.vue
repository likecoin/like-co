<template>
  <section
    id="suggestion-test"
    class="lc-container-0"
  >
    <div>Rewarded: {{ getTotalLIKERewardedStatistic }}</div>
    <div>From: {{ getTotalLikerStatistic }}</div>
    <div>To: {{ getTotalLikeeStatistic }}</div>
    <div>Contents: {{ getTotalLIKEArticleStatistic }}</div>
    <div
      v-for="a in getSuggestedArticles"
      :key="a.url"
    >
      <section v-if="a.user">
        <div>{{ a.user }}</div>
        <img :src="(getUserMinInfoById(a.user)||{}).avatar">
        <div> LIKE: {{ a.like }} </div>
      </section>
      <a :href="a.url">
        <img
          v-if="a.image"
          :src="a.image"
        >
        <div>{{ a.title }}</div>
        <div>{{ a.description }}</div>
      </a>
    </div>
  </section>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'suggestion-test',
  computed: {
    ...mapGetters([
      'getLikeCoinUsdNumericPrice',
      'getTotalLikerStatistic',
      'getTotalLikeeStatistic',
      'getTotalLIKERewardedStatistic',
      'getTotalLIKEArticleStatistic',
      'getSuggestedArticles',
      'getUserMinInfoById',
    ]),
  },
  mounted() {
    this.fetchLikeStatistic();
    this.initList();
  },
  methods: {
    ...mapActions([
      'fetchLikeStatistic',
      'fetchLikeSuggestionList',
      'fetchLikeSuggestionDetails',
      'fetchUserMinInfo',
    ]),
    async initList() {
      await this.fetchLikeSuggestionList();
      const list = this.getSuggestedArticles;
      Object.keys(list).forEach(async (url) => {
        const { info } = await this.fetchLikeSuggestionDetails(url);
        if (!this.getUserMinInfoById(info.user)) {
          this.fetchUserMinInfo(info.user);
        }
      });
    },
  },
};
</script>
