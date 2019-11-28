<template>
  <BaseDialogV2
    ref="dialog"
    class="migrate-token-dialog"
    :is-show="true"
    :is-show-backdrop="true"
    :is-show-header="false"
    :is-closable="true"
    @update:isShow="onUpdateIsShow"
    @click-outside="onCancel"
  >
    <div class="migrate-token-dialog__header">
      <simple-svg
        :filepath="getHeaderArtwork"
        width="236px"
        height="124px"
        fill="#50E3C2"
      />
    </div>
    <div class="migrate-token-dialog__body">
      <div class="migrate-token-dialog__migration-amount">
        {{ value }}
      </div>
      <div class=" lc-margin-top-16">
        {{ $t('MigrateTokenDialog.description') }}
      </div>
      <div class="lc-button-group lc-margin-top-16">
        <md-button
          :href="migrationURL"
          :class="[
            'md-likecoin',
            'lc-gradient-2 lc-font-size-20 lc-font-weight-600 lc-text-center shadow',
          ]"
        >
          {{ $t('Edit.label.migrateLikeCoin') }}
        </md-button>
        <br>
        <a
          href="#"
          @click.prevent="onCancel"
        >{{ $t('General.button.cancel') }}</a>
      </div>
    </div>
  </BaseDialogV2>
</template>


<script>
import BaseDialogV2 from '~/components/dialogs/BaseDialogV2';
import { getMigrationSiteURL } from '@/util/api/api';
import BannerArtwork from '~/assets/authcore-migration-banner-artwork.svg';

export default {
  name: 'migrate-token-dialog',
  components: {
    BaseDialogV2,
  },
  props: {
    value: {
      type: Object,
      default: () => '0',
    },
    username: {
      type: String,
      default: '',
    },
  },
  computed: {
    migrationURL() {
      return getMigrationSiteURL(this.username);
    },
    getHeaderArtwork() {
      return BannerArtwork;
    },
  },
  methods: {
    onUpdateIsShow() {
      // no op
    },
    onCancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style lang="scss">
@import "~assets/variables";

.migrate-token-dialog {
  .base-dialog-v2__content-container {
    overflow: hidden;
  }

  &__header {
    padding: 12px;

    border-bottom: solid 4px $like-cyan;
    background-color: $like-green;
  }

  &__body {
    padding: 16px 40px 24px;
  }

  &__migration-amount {
    text-align: center;

    opacity: 0.3;
    color: $like-gray-5;

    font-size: 56px;
    font-weight: 300;
    line-height: 76px;
  }
}
</style>
