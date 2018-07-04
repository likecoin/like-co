<template>
  <div class="referrer-dialog">
    <base-dialog
      :is-show="isShow"
      :is-show-close-button="true"
      class="lc-dialog with-icon"
      @update:isShow="$emit('update:isShow', $event)"
    >

      <div
        slot="header-center"
        class="lc-section-header-icon lc-dialog-icon lc-raised-icon"
      >
        <img :src="avatar">
      </div>

      <div class="lc-dialog-container-1">
        <h1
          class="lc-font-size-32 lc-font-weight-300 lc-margin-bottom-12"
          v-html="$t('ReferralPage.title', { name: styledDisplayName })"
        />

        <div v-html="$t('ReferralPage.label.invitation', { name: styledDisplayName })" />

        <div class="lc-flex lc-justify-content-center lc-margin-top-32">
          <md-button
            class="md-likecoin"
            @click="$emit('update:isShow', false)"
          >
            {{ $t('KYC.button.createID') }}
          </md-button>
        </div>
      </div>

    </base-dialog>
  </div>
</template>


<script>
import BaseDialog from '~/components/dialogs/BaseDialog';

export default {
  name: 'referrer-dialog',
  components: {
    BaseDialog,
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    referrerId: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    displayName: {
      type: String,
      default: '',
    },
  },
  computed: {
    styledDisplayName() {
      return `<a class="lc-color-like-green lc-font-weight-600" href="/${this.referrerId}">${this.displayName}</a>`;
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.lc-dialog {
  @media (min-width: 600px + 1px) {
    width: 576px;
  }
}
</style>
