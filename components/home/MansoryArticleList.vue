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
      'getSuggestedArticles',
      'getUserMinInfoById',
    ]),
  },
  watch: {
    getSuggestedArticles: {
      handler(articlesObj) {
        this.articles = Object.keys(articlesObj)
          .map(key => articlesObj[key])
          .slice(0, 12);
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
      Object.keys(this.getSuggestedArticles).forEach(async (url) => {
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
