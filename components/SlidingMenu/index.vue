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
              :class="['menu', m.section]">
              <ul>
                <li v-if="m.section === 'primary'">
                  <menu-item
                    :title="getButtonText"
                    :isHighlighted="true"
                    @click="onClickAccountButton" />
                </li>
                <li v-for="i in m.items" :key="i.key">
                  <menu-item
                    :title="i.title || $t(`Menu.item.${i.key}`)"
                    :to="i.to"
                    :isHighlighted="i.isHighlighted"
                    :isExternal="i.isExternal" />
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

import LanguageSwitch from '~/components/LanguageSwitch';
import PlatformIconBar from '~/components/PlatformIconBar';
import MenuItem from './MenuItem';

const MENU_ITEMS = [
  {
    section: 'primary',
    items: [
      {
        key: 'aboutLikeCoin',
        to: '/',
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
        this.$router.push({
          name: this.getUserIsRegistered ? 'in-edit' : 'in-register',
        });
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.dismiss-overlay {
  position: fixed;
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

  padding: 10px 24px;

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
        padding: 10px;
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
  z-index: -30;
  position: fixed;
  top: 0;
  right: 0;
  width: $sliding-menu-width;
  bottom: 0;

  transform: translateX(100%);

  background-color: $like-gray-1;

  @media (max-width: 600px) {
    width: $sliding-menu-narrow-width;
  }
}

.lc-page-wrapper {
  &.with-sliding-menu {
    transition: transform .5s ease-in-out;
    position: relative;

    &::before {
      content: " ";
      position: absolute;
      background-color: white;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
    }

    [lc-sliding-menu="open"] & {
      transform: translateX(-#{$sliding-menu-width});

      @media (max-width: 600px) {
        transform: translateX(-#{$sliding-menu-narrow-width});
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
