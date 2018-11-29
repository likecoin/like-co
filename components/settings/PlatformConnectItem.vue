<template>
  <span
    :class="[
      'platform-connect-item',
      `platform-connect-item--${platform.pid}`,
      `platform-connect-item--${platform.isConnected ? 'connected' : 'disconnected'}`,
      {
        'platform-connect-item--disabled': isDisabled,
      },
    ]"
  >

    <button
      v-if="isShowIcon"
      class="platform-connect-item__icon-button"
      type="button"
      @click="onIconButton"
    >
      <simple-svg
        :filepath="iconPath"
        height="inherit"
        width="inherit"
        fill="currentColor"
      />
    </button>

    <div class="platform-connect-item__setting-group">
      <i18n
        v-if="!platform.isConnected"
        class="platform-connect-item__label"
        path="PlatformConnectItem.connectToPlatform"
        @click="onConnect"
      >
        <span place="platform">{{ platform.pid }}</span>
      </i18n>
      <span
        v-else
        class="platform-connect-item__label"
        @click="onClick"
      >
        <span>{{ userDisplayName }}</span>
        <span>@{{ platform.pid }}</span>
      </span>

      <div
        v-if="platform.options && platform.options.length > 0"
        class="platform-connect-item__option-select"
      >
        <span class="platform-connect-item__option-select__label">
          {{ $t('PlatformConnectItem.options') }}
        </span>
        <!-- TODO: Deprecate vuematerial component -->
        <md-field>
          <md-select
            v-if="selectedOption"
            v-model="selectedOption"
            :disabled="isDisabled"
            md-dense
            @md-selected="onSelectOption"
          >
            <md-option
              v-for="option in platform.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.text }}
            </md-option>
          </md-select>
        </md-field>
      </div>
    </div>

    <button
      v-if="platform.isConnected"
      class="platform-connect-item__disconnect-button"
      @click="onDisconnect"
    >
      <simple-svg
        :filepath="DeleteIcon"
        height="inherit"
        width="inherit"
      />
    </button>

  </span>
</template>

<script>
import DeleteIcon from '~/assets/icons/cross.svg';
import LikeCoinIcon from '~/assets/logo/icon.svg';

import { openURL } from '~/util/client';
import { getUrlWithPrefix } from '~/util/social';

const iconFolder = require.context('../../assets/icons/social-media/');

export default {
  props: {
    platform: {
      type: Object,
      required: true,
    },
    isShowIcon: {
      type: [Boolean, String],
      default: true,
    },
    isDisabled: {
      type: [Boolean, String],
      default: false,
    },
  },
  data() {
    return {
      DeleteIcon,

      selectedOption: this.platform.selectedOption,
    };
  },
  computed: {
    userDisplayName() {
      return this.platform.displayName || this.$t('PlatformConnectItem.linked');
    },
    iconPath() {
      try {
        const { pid, isExternalLink, iconType } = this.platform;
        return iconFolder(`./${isExternalLink ? `link/${iconType}` : pid}.svg`);
      } catch (err) {
        return LikeCoinIcon;
      }
    },
    platformURL() {
      const { url } = this.platform;
      return url ? getUrlWithPrefix(url) : null;
    },
  },
  watch: {
    platform: {
      handler(p) {
        this.selectedOption = p.selectedOption;
      },
      deep: true,
    },
  },
  methods: {
    onClick() {
      if (this.platformURL) {
        openURL(this, this.platformURL, '_blank');
        this.$emit('click', this.platform);
      }
    },
    onConnect() {
      this.$emit('connect', this.platform);
    },
    onDisconnect() {
      this.$emit('disconnect', this.platform);
    },
    onSelectOption(selectedOption) {
      this.$emit('select-option', {
        ...this.platform,
        selectedOption,
      });
    },
    onIconButton() {
      if (this.platform.isConnected) {
        this.onClick();
      } else {
        this.onConnect();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.platform-connect-item {
  display: inline-flex;
  align-items: center;

  min-height: 44px;

  user-select: none;

  &__icon-button {
    flex-shrink: 0;

    width: 28px;
    height: 28px;
    margin-right: 8px;

    cursor: pointer;

    transition: background-color 0.25s ease;

    color: white;
    border: none;
    border-radius: 50%;

    .platform-connect-item--disconnected & {
      color: $gray-9b;
      border: 1px solid currentColor;
      background: transparent;
    }
    .platform-connect-item--disconnected:hover & {
      background-color: transparentize($gray-9b, 0.8);

      &:active {
        background-color: transparentize($gray-9b, 0.5);
      }
    }

    @each $pid, $bg-color in $platform-color-map {
      .platform-connect-item--connected.platform-connect-item--#{$pid} & {
        background-color: $bg-color;

        &:active {
          background-color: darken($bg-color, 10)
        }
      }
    }
  }

  &__label {
    display: block;
    flex-grow: 1;
    flex-shrink: 0;

    cursor: pointer;

    transition: color 0.25s ease;

    &:active {
      transform: translateY(1px);
    }

    .platform-connect-item--disconnected & {
      text-decoration: underline;

      color: $gray-9b;
    }
    .platform-connect-item--disconnected:hover & {
      color: $like-gray-5;
    }
    .platform-connect-item--connected & {
      span:first-child {
        color: $like-green;

        font-weight: 600;
      }
      span:last-child {
        color: $gray-9b;

        font-size: 10px;
      }
    }
    .platform-connect-item--connected:hover & {
      color: darken($like-gray-5, 10);
    }
  }

  &__option-select {
    display: flex;

    min-width: 190px;
    margin-top: 2px;

    &__label {
      flex-shrink: 0;

      color: $gray-9b;

      font-size: 12px;
    }

    .md-field {
      min-height: 0;
      margin: 0;
      margin-left: 4px;
      padding: 0;

      .md-select {
        align-items: center;

        line-height: 16px;

        :global(.md-input) {
          height: 1em;

          font-size: 12px;
          line-height: 16px;
        }
        :global(.md-icon) {
          width: 1em;
          min-width: 0;
          height: 1em;
          min-height: 0;
          margin: 0;

          font-size: 16px !important;

          > :global(svg) {
            width: inherit;
            height: inherit;
          }
        }
      }
    }
  }


  &__disconnect-button {
    flex-shrink: 0;

    width: 24px;
    height: 24px;
    margin-left: 8px;

    cursor: pointer;

    transition: background-color 0.25s ease;

    border: none;
    border-radius: 50%;
    background: transparent;

    &:hover {
      background-color: transparentize($gray-9b, 0.8);
    }
    &:active {
      background-color: transparentize($gray-9b, 0.5);
    }

    .platform-connect-item--disabled & {
      pointer-events: none;

      color: $gray-9b;
    }
  }
}
</style>
