<template>
  <div class="other-connect-list">
    <ul>
      <li
        v-for="p in platforms"
        :key="p.pid"
      >
        <platform-connect-item
          :platform="p"
          @click="onClickPlatform"
          @connect="onConnectPlatform"
          @disconnect="onDisconnectPlatform"
          @select-option="onSelectOption"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import PlatformConnectItem from '~/components/settings/PlatformConnectItem';

import { logTrackerEvent } from '@/util/EventLogger';

export default {
  name: 'other-connect-list',
  components: {
    PlatformConnectItem,
  },
  props: {
    platforms: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    async onConnectPlatform({ pid }) {
      this.$emit('connect', pid);
    },
    onClickPlatform({ pid }) {
      this.$emit('click', pid);
      logTrackerEvent(this, 'Settings', 'ClickPlatformOther', pid, 1);
    },
    async onDisconnectPlatform({ pid }) {
      this.$emit('disconnect', pid);
    },
    onSelectOption({ pid, selectedOption }) {
      this.$emit('select-option', pid, selectedOption);
    },
  },
};
</script>

<style lang="scss" scoped>
.other-connect-list {
  ul {
    display: flex;
    flex-wrap: wrap;

    margin: -8px;

    list-style: none;

    li {
      width: 25%;
      padding: 12px;

      @media screen and (max-width: 1279px) {
        width: calc(100% / 3);
      }
      @media screen and (max-width: 1023px) {
        width: 50%;
      }
      @media screen and (max-width: 680px) {
        width: 100%;
      }
    }
  }
}
</style>
