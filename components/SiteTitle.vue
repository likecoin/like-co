<template>
  <nuxt-link
    :class="['site-title', { test: isTest }]"
    :to="{ name: getToPage }">

    {{ $t('Store.Header.label.store') }}
    <span v-if="isTest" class="sup">
      {{ $t('Store.Header.label.test') }}
    </span>

  </nuxt-link>
</template>

<script>
import { mapGetters } from 'vuex';

import { IS_TESTNET } from '@/constant';

export default {
  name: 'site-title',
  data() {
    return {
      isTest: IS_TESTNET,
    };
  },
  computed: {
    getToPage() {
      return this.getUserIsRegistered ? 'in-edit' : 'index';
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

  @media (max-width: 768px) {
    display: none;
  }
}
</style>
