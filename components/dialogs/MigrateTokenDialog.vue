<template>
  <BaseDialogV2
    ref="dialog"
    :is-show="true"
    :is-show-backdrop="true"
    :is-show-header="true"
    :is-closable="true"
    @update:isShow="onUpdateIsShow"
    @click-outside="onCancel"
  >
    <div
      :class="[
        'likecoin-wallet-banner__value',
        {
          'likecoin-wallet-banner__value--greyed': !!hasErc20Coins,
        },
      ]"
    >
      {{ value }}
    </div>
    <md-button
      :href="migrationURL"
      :class="[
        'md-likecoin',
        'lc-gradient-2 lc-font-size-20 lc-font-weight-600 lc-text-center shadow',
      ]"
    >
      {{ $t('Edit.label.migrateLikeCoin') }}
    </md-button>
    <a
      href="#"
      @click.prevent="onCancel"
    >{{ $t('General.button.cancel') }}</a>
  </BaseDialogV2>
</template>


<script>
import BaseDialogV2 from '~/components/dialogs/BaseDialogV2';
import { getMigrationSiteURL } from '@/util/api/api';

export default {
  name: 'migrate-token-dialog',
  components: {
    BaseDialogV2,
  },
  props: {
    value: {
      type: Object,
      default: null,
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
