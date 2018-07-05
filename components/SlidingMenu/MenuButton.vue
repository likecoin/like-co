<template>
  <div
    :class="['toggle-menu-button', { open: getIsSlidingMenuOpen }]"
    @click="toggleMenu"
  >

    <div class="nav-label">
      <div>{{ $t('Menu.button.menu') }}</div>
      <div>{{ $t('Menu.button.close') }}</div>
    </div>

    <div class="nav-icon">
      <span />
      <span />
      <span />
    </div>

  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'menu-button',
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
    toggleMenu() {
      if (this.getIsSlidingMenuOpen) {
        this.closeSlidingMenu();
      } else {
        this.openSlidingMenu();
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

$button-interspace: 7px;
$hamburger-interspace: 5px;

@mixin hamburger-transform($pos: 1) {
  transform: translateY($pos * $hamburger-interspace) rotateZ(-30deg * $pos) scaleX(0.6);
}

@keyframes menu-button-animation {
  0% { transform: translateX(0); }
  100% { transform: translateX(2px); }
}

.toggle-menu-button {
  position: relative;

  display: flex;
  overflow: hidden;

  height: 34px;

  cursor: pointer;
  text-align: right;

  color: $like-green;

  mask-image: linear-gradient(
    to bottom,
    rgba(0,0,0,0) 0%,
    rgba(0,0,0,1) 20%,
    rgba(0,0,0,1) 80%,
    rgba(0,0,0,0) 100%);

  &:hover {
    .nav-label div {
      animation: {
        name: menu-button-animation;
        duration: .4s;
        direction: alternate;
        timing-function: ease-in-out;
        iteration-count: infinite;
      }
    }
  }

  &.open {
    z-index: 10010;

    .nav-label {
      transform: translateY(-100%);

      will-change: transform;

      span {
        opacity: 1;
      }
    }
  }
}

.nav-label {
  margin: 0 -#{$button-interspace};

  transition: transform .5s ease-out;

  will-change: transform;

  > div {
    padding: $button-interspace;

    user-select: none;
    transition: opacity .5s ease-out;

    font-size: 18px;
    line-height: 20px;

    will-change: opacity;
  }
}

.nav-icon {
  position: relative;

  width: 20px;
  height: 20px;
  margin: $button-interspace 0 $button-interspace $button-interspace;

  span {
    position: absolute;
    right: 0;
    left: 0;

    height: 2px;

    transition: transform .5s ease-out;
    transform-origin: left center;

    background-color: currentColor;

    will-change: transform;

    @for $i from 1 through 3 {
      &:nth-of-type(#{$i}) {
        top: 4px + $hamburger-interspace * ($i - 1);

        .open & {
          @if $i == 1 {
            @include hamburger-transform();
          } @else if $i == 3 {
            @include hamburger-transform(-1);
          }
        }
      }
    }
  }
}
</style>
