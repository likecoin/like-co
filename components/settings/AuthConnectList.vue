<template>
  <ul class="auth-connect-list">
    <li
      v-for="p in platforms"
      :key="p.pid"
      class="auth-connect-list__item"
    >
      <div>
        <h3>{{ t$(p.pid, p.isConnected ? 'connectedTitle' : 'title' ) }}</h3>
        <p v-if="getDescription(p)">{{ getDescription(p) }}</p>
      </div>
      <div>
        <l-button
          v-if="!p.isConnected"
          :class="`l-button--${p.pid}`"
          :title="$t('General.connect')"
          :is-disabled="isLoading"
          @click="onConnectPlatform(p)"
        >
          <simple-svg
            slot="icon"
            :filepath="iconMap[p.pid]"
            :preserve-color="p.pid === 'google'"
            fill="currentColor"
            stroke="transparent"
            width="inherit"
            height="inherit"
          />
        </l-button>
        <template v-else>
          <l-button
            v-if="p.pid === 'google'"
            :title="$t('General.disconnect')"
            :is-disabled="isLoading"
            @click="onDisconnectPlatform(p)"
          />
          <platform-connect-item
            v-else
            :platform="p"
            :is-show-icon="false"
            :is-disabled="isLoading"
            @click="onClickPlatform"
            @disconnect="onDisconnectPlatform"
            @select-option="onSelectOption"
          />
        </template>
      </div>
    </li>
  </ul>
</template>

<script>
import PlatformConnectItem from './PlatformConnectItem';
import LButton from '~/components/LButton';

import FacebookIcon from '~/assets/icons/fillable/facebook.svg';
import GoogleIcon from '~/assets/icons/google.svg';
import TwitterIcon from '~/assets/icons/fillable/twitter.svg';
import MattersIcon from '~/assets/icons/fillable/matters.svg';

import { logTrackerEvent } from '~/util/EventLogger';

export default {
  name: 'auth-connect-list',
  components: {
    LButton,
    PlatformConnectItem,
  },
  props: {
    platforms: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: [Boolean, String],
      default: false,
    },
  },
  data() {
    return {
      iconMap: {
        facebook: FacebookIcon,
        google: GoogleIcon,
        twitter: TwitterIcon,
        matters: MattersIcon,
      },
    };
  },
  methods: {
    t$(pid, path) {
      const key = `AuthConnectList.${pid}.${path}`;
      return this.$te(key, 'en') ? this.$t(key) : '';
    },
    getDescription({ pid, isConnected }) {
      return (isConnected ? this.t$(pid, 'connected') : '') + this.t$(pid, 'disclaimer');
    },
    onConnectPlatform({ pid }) {
      this.$emit('connect', pid);
    },
    onClickPlatform({ pid }) {
      logTrackerEvent(this, 'Settings', 'ClickPlatformAuth', pid, 1);
    },
    onDisconnectPlatform({ pid }) {
      this.$emit('disconnect', pid);
    },
    onSelectOption({ pid, selectedOption }) {
      this.$emit('select-option', pid, selectedOption);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.auth-connect-list {
  &__item {
    display: flex;

    @media screen and (max-width: 768px) {
      flex-direction: column;
    }

    &:not(:first-child) {
      margin-top: 48px;
    }

    > div {
      &:nth-child(1) {
        flex: 1;

        padding-right: 24px;

        font-size: 14px;

        > * {
          max-width: 480px;
        }

        h3 {
          font-size: inherit;
          font-weight: 400;
        }

        p {
          margin-top: 8px;

          color: $gray-9b;

          font-size: inherit;
        }
      }

      &:nth-child(2) {
        display: flex;
        align-items: center;
        flex-grow: 0;
        flex-shrink: 0;

        @media screen and (max-width: 768px) {
          > .l-button {
            margin-top: 16px;
          }
          > .platform-connect-item {
            margin-top: 8px;
          }
        }
      }
    }
  }
}

.l-button {
  @each $platform in google facebook twitter matters {
    &--#{$platform} {
      background-color: map-get($platform-color-map, $platform);
    }
  }

  &--google {
    color: #4385f4;
  }
}
</style>
