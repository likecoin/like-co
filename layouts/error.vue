<template>
  <div class="lc-container-0">
    <div class="lc-container-1">
      <div class="lc-container-2">
        <div class="lc-container-3 lc-bg-gray-1 lc-padding-vertical-32">
          <div class="lc-container-4 error-container">
            <img
              :src="likeCoinIcon"
              alt="LikeCoin Logo"
            >
            <h1 class="lc-font-size-56 lc-margin-vertical-32">
              {{ error.statusCode }}
            </h1>
            <h2>
              {{ error.message }}
            </h2>
            <nuxt-link
              v-if="error.statusCode === 404"
              to="/"
            >
              {{ $t('Error.button.toIndex') }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import likeCoinIcon from '@/assets/logo/icon.svg';

export default {
  props: ['error'],
  layout: 'narrowWithHeader',
  data() {
    return {
      likeCoinIcon,
    };
  },
  computed: {
    ...mapGetters([
      'getCurrentLocale',
      'getCurrentLocaleISO',
    ]),
  },
  head() {
    return {
      htmlAttrs: {
        lang: this.getCurrentLocaleISO,
      },
      bodyAttrs: {
        'lc-lang': this.getCurrentLocale,
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
