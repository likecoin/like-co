<template>
  <div class="like-button-demo">
    <i18n
      class="lc-margin-top-8 lc-font-weight-600"
      path="Home.LikeButtonDemo.label.lookForButton"
      tag="p"
    >
      <span
        class="bold lc-cursor-pointer"
        place="LikeButton"
        @click="openContentCivicPopup"
      >{{ $t('Home.LikeButtonDemo.label.button') }}</span>
    </i18n>

    <sample-like-button
      class="lc-margin-top-24"
      @like="openContentCivicPopup"
      @toggle="openContentCivicPopup"
    />
  </div>
</template>


<script>
import SampleLikeButton from '~/components/home/SampleLikeButton';

import likeCoinIcon from '@/assets/logo/icon-label-horizontal.svg';

export default {
  name: 'like-button-demo',
  components: {
    SampleLikeButton,
  },
  data() {
    return {
      likeCoinIcon,
    };
  },
  methods: {
    openContentCivicPopup() {
      this.$emit('popup');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.like-button-demo {
  display: flex;
  flex-direction: column;

  @media (min-width: 600px + 1px) {
    width: 272px;
    margin-top: -32px;
    margin-right: 32px;
    padding: 24px;

    background-image: linear-gradient(194deg, $like-light-blue, $like-gradient-1);
  }

  @media (max-width: 600px) {
    flex-direction: column-reverse;
    order: 999;

    padding: 8px 24px 24px;
  }
}
</style>
