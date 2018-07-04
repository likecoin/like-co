<template>
  <div
    :class="[
      'menu-item',
      {
        'highlighted': isHighlighted,
      },
    ]"
    @click="onClickMenuItem">

    <a v-if="isExternal || !to" :href="to">
      <slot/>
    </a>
    <nuxt-link v-else :to="to">
      <slot/>
    </nuxt-link>

  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'menu-item',
  props: {
    isHighlighted: {
      type: Boolean,
      default: false,
    },
    to: {
      type: [String, Object],
    },
    isExternal: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...mapActions([
      'closeSlidingMenu',
    ]),
    onClickMenuItem() {
      this.closeSlidingMenu();
      this.$emit('click');
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.menu-item {
  display: inline;

  cursor: pointer;

  color: $like-green;

  font-weight: 300;

  &:hover {
    > a::before {
      width: 100%;
    }
  }

  &.highlighted {
    font-weight: 600;
  }

  .primary & {
    font-size: 20px;

    @media (max-width: 600px) {
      font-size: 16px;
    }
  }

  .secondary & {
    font-size: 16px;

    @media (max-width: 600px) {
      font-size: 12px;
    }

    :global(.md-icon),
    :global(svg) {
      width: 16px;
      min-width: 16px;
      height: 16px;
      min-height: 16px;
    }
  }

  > a {
    position: relative;

    display: inline-flex;
    align-items: center;

    text-decoration: none;

    &::before {
      position: absolute;
      top: calc(100% + 3px);
      left: 0;

      width: 0%;
      height: 2px;

      content: " ";

      transition: width 0.25s ease-out;

      background-color: $like-green;
    }

    :global(.md-svg-loader) {
      display: inline-flex;
    }

    :global(.md-icon:not(:last-child)) {
      margin-right: 4px;
    }

    :global(svg) {
      fill: $like-green !important;
    }
  }
}
</style>
