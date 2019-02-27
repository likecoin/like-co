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
import localeMixin from '~/mixins/locale';

import likeCoinIcon from '@/assets/logo/icon.svg';

export default {
  layout: 'narrowWithHeader',
  mixins: [localeMixin],
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      likeCoinIcon,
    };
  },
};
</script>

<style lang="scss" scoped>
.error-container {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
