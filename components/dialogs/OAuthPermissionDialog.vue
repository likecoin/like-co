<template>
  <base-dialog
    :is-show="isShow"
    :md-props="{
      mdBackdrop: false,
      mdClickOutsideToClose: false,
      mdCloseOnEsc: false,
      mdFullscreen: true,
    }"
    class="oauth-permission-dialog"
    @update:isShow="setIsShow"
  >
    <div
      slot="header-left"
      class="oauth-permission-dialog__header-left"
    >
      <img :src="LikeCoinLogo">
    </div>

    <div class="oauth-permission-dialog__content">
      <div class="provider-info lc-dialog-container-1">
        <div class="provider-info__logo">
          <img :src="providerLogo">
        </div>
        <div class="provider-info__name">{{ provider.displayName }}</div>
        <div class="provider-info__description">{{ provider.description }}</div>
      </div>

      <div class="scope-info lc-dialog-container-1">
        <div>{{ $t('OAuthPermissionDialog.willReceive') }}</div>
        <ul>
          <li
            v-for="s in scope"
            :key="s"
          >
            {{ $t(`OAuthPermissionDialog.scope.${s}`) }}
          </li>
        </ul>
      </div>

      <div class="lc-dialog-container-1 lc-button-group">
        <md-button
          class="md-likecoin"
          @click="onAccept"
        >
          {{ $t('General.accept') }}
        </md-button><br>
        <md-button
          class="md-likecoin lc-cancel"
          @click="onDecline"
        >
          {{ $t('General.decline') }}
        </md-button>
      </div>
    </div>

  </base-dialog>
</template>

<script>
import BaseDialog from '~/components/dialogs/BaseDialog';

import LikeCoinLogo from '~/assets/icons/likecoin-text-logo.svg';
import DefaultProviderLogo from '~/assets/icons/default-sp.svg';

export default {
  name: 'oauth-permission-dialog',
  components: {
    BaseDialog,
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: Object,
      default: () => ({
        displayName: '',
        description: '',
      }),
    },
    scope: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      LikeCoinLogo,
    };
  },
  computed: {
    providerLogo() {
      // TODO: Use provder logo when available
      return DefaultProviderLogo;
    },
  },
  methods: {
    setIsShow(isShow) {
      this.$emit('update:isShow', isShow);
    },
    onAccept() {
      this.setIsShow(false);
      this.$emit('accept');
    },
    onDecline() {
      this.setIsShow(false);
      this.$emit('decline');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/variables';

.oauth-permission-dialog {
  &__header-left {
    img {
      position: relative;

      width: 96px;
      margin-left: 12px;
    }
  }

  :global(.lc-dialog-content) {
    display: flex;
    flex-direction: column;
  }

  &__content {
    display: inherit;
    flex-direction: inherit;
    flex-grow: 1;
  }
}

.provider-info {
  text-align: center;

  &__logo {
    overflow: hidden;

    width: 96px;
    height: 96px;
    margin: 16px auto;

    border-radius: 12px;

    background: $like-gray-2;

    > img {
      width: 100%;
      height: 100%;

      object-fit: cover;
      object-position: center;
    }
  }

  &__name {
    color: $like-green;

    font-size: 24px;
    font-weight: 300;
    line-height: 1.2;
  }

  &__description {
    margin-top: 4px;

    color: $like-gray-4;

    font-size: 14px;
  }
}

.scope-info {
  flex-grow: 1;

  margin: 24px 0 32px;

  text-align: center;

  color: $like-gray-4;

  ul {
    list-style: none;

    li {
      color: $like-gray-5;

      font-weight: 600;
    }
  }
}
</style>
