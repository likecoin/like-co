<template>
  <nuxt-link
    :class="['site-title', { test: isTest }]"
    :to="{ name: getToPage }"
  >

    <img
      :src="likeCoinIcon"
      alt="like.co/in"
    >
    <span
      v-if="isTest"
      class="sup"
    >
      {{ $t('Store.Header.label.test') }}
    </span>

  </nuxt-link>
</template>

<script>
import { mapGetters } from 'vuex';

import { IS_TESTNET } from '@/constant';
import likeCoinIcon from '@/assets/logo/in-link.svg';

export default {
  name: 'site-title',
  data() {
    return {
      isTest: IS_TESTNET,
      likeCoinIcon,
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
