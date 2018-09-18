<template>
  <div class="liker-list">
    <div class="lc-container-2">
      <like-form>
        <template slot="header-right">
          <a
            class="lc-underline"
            href="https://like.co/"
            rel="noopener noreferrer"
            target="_blank"
          >{{ $t('LikerList.label.aboutLikeCoin') }}</a>
        </template>

        <span
          v-if="hasFetchedListDetails"
          class="lc-color-like-dark-brown-2 lc-font-size-20"
        >
          {{ $t('Embed.label.numLikesForArticle', {
            numOfLikees: likers.length,
            numOfLikes,
          }) }}
        </span>

        <div
          :class="['liker-list__wrapper', 'lc-margin-top-8', { expand: isShowAll }]"
          :style="{ maxHeight: `${Math.ceil(likers.length / 2) * 74}px` }"
        >

          <user-avatar
            v-for="(liker, index) in likers"
            :key="index"
            :user="getUserDetails(liker)"
          />

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
            class="lc-color-like-green lc-underline"
            @click="isShowAll = true"
          >
            {{ $t('Embed.button.showMore') }}
          </md-button>
        </div>
      </like-form>
    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import LikeForm from '~/components/LikeForm';
import UserAvatar from '~/components/UserAvatar';

const NUM_DEFAULT_LIKERS_TO_SHOW = 8;

export default {
  name: 'liker-list',
  components: {
    LikeForm,
    UserAvatar,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    referrer: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isShowAll: true,
    };
  },
  computed: {
    ...mapGetters([
      'getLikerListDetails',
      'getUserMinInfoById',
    ]),
    likerListDetails() {
      return this.getLikerListDetails(this.referrer) || {};
    },
    hasFetchedListDetails() {
      return !!this.getLikerListDetails(this.referrer);
    },
    likers() {
      return this.likerListDetails.likers || [];
    },
    numOfLikes() {
      return this.likerListDetails.numOfLikes || 0;
    },
  },
  watch: {
    likers(list) {
      this.isShowAll = list.length <= NUM_DEFAULT_LIKERS_TO_SHOW;
    },
  },
  mounted() {
    const { id, referrer, hasFetchedListDetails } = this;
    if (!hasFetchedListDetails) {
      this.fetchLikeButtonStatistics({ id, referrer });
    }
  },
  methods: {
    ...mapActions([
      'fetchLikeButtonStatistics',
    ]),
    getUserDetails(id) {
      return {
        ...this.getUserMinInfoById(id),
        id,
      };
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";
@import "~assets/mixin";

$user-avatar-image-size: 48px;

.liker-list {
  margin-bottom: 48px;

  .user-avatar {
    min-height: 72px;
    padding-top: 16px;
    padding-bottom: 8px;

    border-bottom: 1px solid #e6e6e6;
  }
}

.liker-list__wrapper {
  position: relative;

  display: flex;
  overflow: hidden;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  transition: max-height 0.25s ease-in-out;

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
    height: calc(100% - 226px);

    background-image: linear-gradient(to bottom, rgba(247, 247, 247, 0), $like-gray-1);
  }
}
</style>
