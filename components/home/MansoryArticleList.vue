<template>
  <div class="mansory-article-list">
    <div
      v-for="article in articles"
      :key="article.url"
    >
      <mansory-article-item
        v-scroll-reveal
        v-if="article.title"
        :article="article"
      />
      <mansory-article-item-placeholder v-else />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import MansoryArticleItem from './MansoryArticleItem';
import MansoryArticleItemPlaceholder from './MansoryArticleItemPlaceholder';

const MAX_ARTICLES_DISPLAY = 12;

export default {
  name: 'mansory-article-list',
  components: {
    MansoryArticleItem,
    MansoryArticleItemPlaceholder,
  },
  data() {
    return {
      articles: [],
    };
  },
  computed: {
    ...mapGetters([
      'getSuggestedArticleList',
      'getSuggestedArticleInfo',
      'getUserMinInfoById',
    ]),
  },
  watch: {
    getSuggestedArticleInfo: {
      handler() {
        this.articles = this.getSuggestedArticleList
          .filter(url => !!this.getSuggestedArticleInfo[url])
          .map(url => this.getSuggestedArticleInfo[url])
          .slice(0, MAX_ARTICLES_DISPLAY);
      },
      deep: true,
    },
  },
  mounted() {
    this.initList();
  },
  methods: {
    ...mapActions([
      'fetchLikeSuggestionList',
      'fetchLikeSuggestionDetails',
      'fetchUserMinInfo',
    ]),
    async initList() {
      await this.fetchLikeSuggestionList();
      this.getSuggestedArticleList.forEach(async (url) => {
        await this.fetchLikeSuggestionDetails(url);
        const { info } = await this.fetchLikeSuggestionDetails(url);
        if (info && !this.getUserMinInfoById(info.user)) {
          this.fetchUserMinInfo(info.user);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.mansory-article-list {
  column-count: 2;
  column-gap: 28px;

  @media (max-width: 600px) {
    column-count: 1;
  }

  > div > * {
    padding: 8px 0;

    @media (max-width: 600px) {
      padding: 4px 0;
    }
  }
}
</style>
