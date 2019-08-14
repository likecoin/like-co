<template>
  <div
    id="view-bigdipper"
    class="lc-padding-vertical-32"
  >
    <a
      :href="getUrl"
      class="view-url lc-font-weight-300 lc-font-size-16 lc-color-like-green"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ text || $t('Toolbar.bigdipper.button.view') }}
    </a>
  </div>
</template>

<script>
import { BIGDIPPER_HOST } from '@/constant';

export default {
  name: 'view-bigdipper',
  props: {
    text: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    transaction: {
      type: String,
      default: '',
    },
  },
  computed: {
    getUrl() {
      if (this.address) return `${BIGDIPPER_HOST}/account/${this.address}`;
      if (this.transaction) return `${BIGDIPPER_HOST}/transactions/${this.transaction}`;
      return BIGDIPPER_HOST;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

#view-bigdipper {
  position: relative;

  text-align: center;

  .view-url {
    text-decoration: underline;
  }
}
</style>
