<template>
  <div class="lc-sliding-menu-container">
    <div class="dismiss-overlay" @click="closeSlidingMenu" />
    <div class="lc-sliding-menu-wrapper">
      <nav class="lc-sliding-menu">
        <div>

          <div class="language-switch-wrapper">
            <language-switch color="white" :isShowLabel="true" />
          </div>

          <div class="social-media-links-wrapper">
            <platform-icon-bar />
          </div>

          <div class="menus-wrapper">
            <div
              v-for="m in MENU_ITEMS"
              :key="m.section"
              :class="['menu', m.section]">
              <ul>
                <li v-if="m.section === 'primary'">
                  <menu-item :to="{ name: 'index' }">
                    <md-icon :md-src="HomeIcon"></md-icon>
                  </menu-item>
                </li>
                <li v-if="m.section === 'primary'">
                  <menu-item
                    v-if="!getUserIsRegistered && showLogin"
                    :isHighlighted="true"
                    @click="onClickAccountButton">
                    {{ getButtonText }}
                  </menu-item>
                  <menu-item
                    v-else
                    :isHighlighted="true"
                    :to="{ name: 'in' }">
                    {{ getButtonText }}
                  </menu-item>
                </li>
                <li
                  v-for="i in m.items"
                  v-if="getUserIsRegistered || !i.isRegistered"
                  :key="i.key">
                  <menu-item
                    :to="i.to"
                    :isHighlighted="i.isHighlighted"
                    :isExternal="i.isExternal">
                    {{ $t(`Menu.item.${i.key}`) }}
                  </menu-item>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </nav>
    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import HomeIcon from '@/assets/icons/home.svg';

import LanguageSwitch from '~/components/LanguageSwitch';
import PlatformIconBar from '~/components/PlatformIconBar';
import MenuItem from './MenuItem';

const MENU_ITEMS = [
  {
    section: 'primary',
    items: [
      {
        key: 'aboutLikeCoin',
        to: { name: 'index' },
      },
      {
        key: 'bonus',
        to: { name: 'in-bonus' },
        isRegistered: true,
      },
      {
        key: 'joinTokenSale',
        to: { name: 'in-tokensale' },
      },
      {
        key: 'backer',
        to: { name: 'in-backer' },
      },
      {
        key: 'whitepaper',
        to: { name: 'in-whitepaper' },
      },
    ],
  },
  {
    section: 'secondary',
    items: [
      {
        key: 'press',
        to: 'https://press.like.co/',
        isExternal: true,
      },
      {
        key: 'poc',
        to: 'https://meme.like.co/',
        isExternal: true,
      },
      {
        key: 'support',
        to: 'https://help.like.co/',
        isExternal: true,
      },
    ],
  },
];

export default {
  name: 'sliding-menu',
  props: [
    'showLogin',
  ],
  components: {
    MenuItem,
    LanguageSwitch,
    PlatformIconBar,
  },
  head() {
    return {
      htmlAttrs: {
        'lc-sliding-menu': this.getIsSlidingMenuOpen ? 'open' : 'close',
      },
    };
  },
  data() {
    return {
      MENU_ITEMS,
      HomeIcon,
    };
  },
  computed: {
    getButtonText() {
      if (this.getUserIsRegistered) return this.getUserInfo.user;
      return this.$t(this.showLogin ? 'Home.Header.button.signIn' : 'Home.Header.button.signUp');
    },
    shouldHideRegister() {
      return (
        (!this.getUserIsRegistered && ['in-register', 'in-redeem'].includes(this.$route.name))
        || this.$route.name === 'in-edit'
      );
    },
    ...mapGetters([
      'getUserInfo',
      'getUserIsRegistered',
      'getIsSlidingMenuOpen',
    ]),
  },
  methods: {
    ...mapActions([
      'showLoginWindow',
      'closeSlidingMenu',
    ]),
    onClickAccountButton() {
      if (!this.getUserIsRegistered && this.showLogin) {
        this.showLoginWindow();
      } else {
        this.$router.push({ name: 'in' });
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.dismiss-overlay {
  position: absolute;
  z-index: 9999;
  top: 0;
  right: 0;
  bottom: 0;

  display: block;

  width: 100vw;

  content: " ";

  [lc-sliding-menu="close"] & {
    display: none;
  }
}

.lc-sliding-menu {
  position: relative;

  height: 100vh;

  > div {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    display: flex;
    overflow-y: auto;
    flex-direction: column;
  }
}

.language-switch-wrapper {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  justify-content: flex-end;

  min-height: 52px;
  padding: 10px 24px;

  color: white;
  background-color: $like-green;
}

.social-media-links-wrapper {
  display: flex;
  flex-shrink: 0;
  justify-content: center;

  padding: 10px 6px;

  background-color: white;
}

.menus-wrapper {
  border-top: 1px solid $like-green;
  padding: 64px 24px 100px 52px;

  flex-grow: 1;

  @media (max-width: 600px) {
    padding: 32px 24px 100px 32px;
  }

  .menu {
    ul {
      list-style: none;
      margin: -10px;
      padding: 0;

      li {
        padding: 8px;

        @media (max-width: 600px) {
          padding: 6px;
        }
      }
    }

    &:not(:first-child) {
      margin-top: 40px;

      @media (max-width: 600px) {
        margin-top: 20px;
      }
    }
  }
}
</style>

<style lang="scss">
@import "~assets/variables";

$sliding-menu-width: 320px;
$sliding-menu-narrow-width: 260px;

.lc-sliding-menu-wrapper {
  position: absolute;
  top: 0;
  right: -$sliding-menu-width;
  bottom: 0;

  width: $sliding-menu-width;

  background-color: $like-gray-1;

  &::after {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;

    width: 4px;

    content: " ";
    pointer-events: none;

    background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.0));
  }

  @media (max-width: 600px) {
    right: -$sliding-menu-narrow-width;

    width: $sliding-menu-narrow-width;
  }
}

.lc-page-wrapper {
  &.with-sliding-menu {
    position: relative;

    transition: transform .5s ease-in-out;
    will-change: transform;

    [lc-sliding-menu="open"] & {
      transform: translateX(-$sliding-menu-width);

      @media (max-width: 600px) {
        transform: translateX(-$sliding-menu-narrow-width);
      }
    }
  }
}

[lc-sliding-menu="open"] {
  overflow-y: hidden;

  body {
    overflow-y: hidden;
  }
}
</style>
