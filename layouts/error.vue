<template>
  <div class="lc-container-0">
    <div class="lc-container-1">
      <div class="lc-container-2">
        <div class="lc-container-3 lc-bg-gray-1 lc-padding-vertical-32">
          <div class="lc-container-4 error-container">
            <img src="../assets/like-coin.svg" alt="LikeCoin Logo" />
            <h1 class="lc-font-size-56 lc-margin-vertical-32">
              {{ error.statusCode }}
            </h1>
            <h2>
              {{ error.message }}
            </h2>
            <nuxt-link to="/" v-if="error.statusCode === 404">
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

export default {
  props: ['error'],
  layout: 'narrowWithHeader',
  computed: {
    ...mapGetters([
      'getCurrentLocale',
    ]),
  },
  head() {
    return {
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
