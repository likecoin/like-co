<template>
  <div :class="['toggle-menu-button', { open: getIsSlidingMenuOpen }]">
    <div>

      <div @click="openSlidingMenu">
        <span>{{ $t('Menu.button.menu') }}</span><img :src="MenuIcon" />
      </div>
      <div @click="closeSlidingMenu">
        <span>{{ $t('Menu.button.close') }}</span><img :src="ArrowIcon" />
      </div>

    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import MenuIcon from '@/assets/icons/menu.svg';
import ArrowIcon from '@/assets/icons/arrow-right.svg';

export default {
  name: 'menu-button',
  data() {
    return {
      MenuIcon,
      ArrowIcon,
    };
  },
  computed: {
    ...mapGetters([
      'getIsSlidingMenuOpen',
    ]),
  },
  methods: {
    ...mapActions([
      'openSlidingMenu',
      'closeSlidingMenu',
    ]),
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

$button-interspace: 10px;

.toggle-menu-button {
  position: relative;

  overflow: hidden;

  height: 34px;

  text-align: right;

  color: $like-green;

  font-size: 18px;

  &.open {
    z-index: 10010;

    > div {
      transform: translateY(-50%);
      will-change: transform;
    }
  }

  > div {
    margin: 0 -#{$button-interspace};

    transition: transform 0.15s ease-out;

    > div {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      padding: $button-interspace;

      cursor: pointer;
      user-select: none;

      &:hover {
        transform: translateY(-1px);
      }

      span {
        font-size: 18px;
        line-height: 14px;
      }

      img {
        width: 20px;
        height: 14px;
        margin-left: 16px;
      }
    }
  }
}
</style>
