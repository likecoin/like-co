<template>
  <div class="lc-container-1 likee-list-page">
    <div class="lc-container-2">
      <like-form>
        <template slot="header-right">
          <a
            class="lc-underline"
            href="https://like.co/"
            rel="noopener noreferrer"
            target="_blank"
          >
            About LikeCoin
          </a>
        </template>

        <span class="lc-color-like-dark-brown-2 lc-font-size-20">
          {{ numOfLikes }} Like from {{ likees.length }} people
          <span v-if="title">{{ title }}</span>
        </span>

        <div
          :class="['likee-list', 'lc-margin-top-8', { expand: isShowAll }]"
          :style="{ maxHeight: `${Math.ceil(likees.length / 2) * 74}px` }"
        >

          <div
            v-for="(likee, index) in likees"
            :key="index"
            class="user-avatar"
          >
            <img
              v-if="likee.avatar"
              :src="likee.avatar"
            >
            <nuxt-link
              :to="{ name: 'id', params: { id: likee.id } }"
            >
              <span v-if="likee.displayName">{{ likee.displayName }}</span>
              <span v-else>{{ likee.id }}</span>
            </nuxt-link>
          </div>

          <transition name="lc-transition-default">
            <div
              v-if="!isShowAll"
              class="overflow-overlay"
            />
          </transition>
        </div>

        <div
          class="lc-margin-top-12 lc-text-align-center"
        >
          <md-button
            v-if="!isShowAll"
            class="lc-color-like-green"
            @click="isShowAll = true"
          >
            show more
          </md-button>
        </div>
      </like-form>
    </div>
  </div>
</template>


<script>
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import axios from '~/plugins/axios';
import LikeForm from '~/components/LikeForm';
import {
  apiGetUserMinById,
  apiGetLikeButtonLikerList,
  apiGetLikeButtonTotalCount,
} from '@/util/api/api';

export default {
  name: 'embed-id-list',
  layout: 'narrowWithHeader',
  components: {
    LikeForm,
  },
  async asyncData({ params, query }) {
    const promises = [
      apiGetLikeButtonLikerList(params.id, query.referrer),
      apiGetLikeButtonTotalCount(params.id, query.referrer),
    ];
    if (query.referrer) {
      let url = encodeURI(query.referrer);
      /* TEMP: reformat medium referrer into medium post */
      const mediumRegEx = '^(?:https?:\\/\\/)?medium\\.com\\/media\\/[a-zA-Z0-9_]+\\?postId=([a-zA-Z0-9_]+)';
      const match = query.referrer.match(mediumRegEx);
      if (match && match[1]) url = `https://medium.com/p/${match[1]}`;
      /* Try to get html to fetch title below */
      promises.push(axios.get(url, { responseType: 'text', headers: { Accept: 'text/html' } }).catch(() => ''));
    }
    const [{ data: likees }, { data: totalData }, { data: html } = {}] =
      await Promise.all(promises);
    let title = '';
    if (html) {
      const match = html.match('<title>(.*?)</title>');
      if (match && match[1]) [, title] = match;
    }
    return {
      title,
      isShowAll: likees.length <= 8,
      numOfLikes: totalData.total,
      likees: likees.map(id => ({ id })),
    };
  },
  data() {
    return {
      isShowAll: false,
    };
  },
  computed: {
    referrer() {
      return this.$route.query.referrer;
    },
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    async fetchList() {
      this.likees.forEach(async (r) => {
        try {
          const { data } = await apiGetUserMinById(r.id);
          Vue.set(r, 'avatar', data.avatar);
          Vue.set(r, 'displayName', data.displayName);
        } catch (err) {
          console.error(err);
        }
      });
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.user-avatar {
  padding-top: 16px;
  padding-bottom: 8px;

  border-bottom: 1px solid #e6e6e6;

  img {
    width: 48px;
    height: 48px;

    border-radius: 50%;
    background-color: $like-white;
  }

  span {
    margin-left: 12px;

    color: $like-green;

    font-size: 18px;
    font-weight: 600;
  }
}

.likee-list-page {
  .md-button {
    text-decoration: underline;
  }
}

.likee-list {
  position: relative;

  display: flex;
  overflow: hidden;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  transition: max-height 0.25s ease-out;

  &:not(.expand) {
    max-height: 272px !important;
  }

  > * {
    width: calc(50% - 16px);
  }

  .overflow-overlay {
    position: absolute;
    bottom: 0;
    left: 0;

    width: 100%;
    height: 48px;

    background-image: linear-gradient(to bottom, rgba(247, 247, 247, 0), $like-gray-1);
  }
}
</style>
