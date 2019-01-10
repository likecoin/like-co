<template>
  <h1>
    <nuxt-link
      :class="['site-title', { test: isTest }]"
      :to="{ name: getToPage }"
    >
      <img
        :src="logoSrc"
        alt="LikeCoin"
      >
      <span
        v-if="isTest"
        class="sup"
      >
        {{ $t('Store.Header.label.test') }}
      </span>

    </nuxt-link>
  </h1>
</template>

<script>
import { mapGetters } from 'vuex';

import { IS_TESTNET } from '@/constant';
import likeCoinIcon from '@/assets/logo/in-link.svg';
import likeCoinColorIcon from '@/assets/logo/color-icon-label-horizontal.svg';

export default {
  name: 'site-title',
  props: {
    logoSrc: {
      type: String,
      default: likeCoinIcon,
    },
  },
  data() {
    return {
      isTest: IS_TESTNET,
      likeCoinIcon,
      likeCoinColorIcon,
    };
  },
  computed: {
    getToPage() {
      return this.getUserIsRegistered ? 'in' : 'index';
    },
    ...mapGetters([
      'getUserIsRegistered',
    ]),
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/variables';

.site-title {
  text-decoration: none !important;

  color: $like-green;

  font-size: 18px;

  &.test {
    color: $like-red;
  }

  > .sup {
    vertical-align: super;

    font-size: 12px;
  }
}
</style>
