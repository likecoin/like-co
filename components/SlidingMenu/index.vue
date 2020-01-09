<template>
  <div class="lc-sliding-menu-container">
    <div
      class="dismiss-overlay"
      @click="closeSlidingMenu"
    />
    <div class="lc-sliding-menu-wrapper">
      <nav
        :style="slidingMenuStyle"
        class="lc-sliding-menu"
      >
        <div>

          <div class="language-switch-wrapper">
            <language-switch
              :isShowLabel="true"
              color="white"
            />
          </div>

          <div class="social-media-links-wrapper">
            <platform-icon-bar />
          </div>

          <hr>

          <account-overview
            v-if="getUserIsRegistered"
            class="lc-margin-bottom-40"
          />

          <div class="menus-wrapper main">
            <div
              v-for="m in MENU_ITEMS"
              :key="m.section"
              :class="['menu', m.section]"
            >
              <ul>
                <template v-if="m.section === 'primary'">
                  <li>
                    <menu-item :to="{ name: 'index' }">
                      <md-icon :md-src="HomeIcon" />
                    </menu-item>
                  </li>
                  <li v-if="getUserIsRegistered">
                    <menu-item
                      :isHighlighted="true"
                      :to="{ name: 'in' }"
                    >
                      {{ getUserInfo.user }}
                    </menu-item>
                  </li>
                  <template v-else>
                    <li>
                      <menu-item
                        :isHighlighted="true"
                        @click="onClickSignUpButton()"
                      >
                        {{ $t('Home.Header.button.signUp') }}
                      </menu-item>
                    </li>
                    <li>
                      <menu-item
                        @click="onClickSignInButton"
                      >
                        {{ $t('Home.Header.button.signIn') }}
                      </menu-item>
                    </li>
                  </template>
                </template>
                <!-- tricky to turn into computed, disable lint for now -->
                <!-- eslint-disable vue/no-use-v-if-with-v-for -->
                <li
                  v-for="i in m.items"
                  v-if="getUserIsRegistered || !i.isRegistered"
                  :key="i.key"
                >
                  <menu-item
                    :to="i.to"
                    :isHighlighted="i.isHighlighted"
                    :isExternal="i.isExternal"
                  >
                    {{ $t(`Menu.item.${i.key}`) }}
                    <md-icon
                      v-if="i.icon"
                      :md-src="i.icon"
                      class="menu-item__icon"
                    />
                  </menu-item>
                </li>
              </ul>
            </div>
          </div>

          <div
            v-if="getUserIsRegistered"
            class="menus-wrapper bottom"
          >
            <div class="menu secondary">
              <ul>
                <li>
                  <menu-item @click="onClickLogoutButon">
                    <span>{{ $t('Menu.item.logout') }}</span>
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
import { checkIsMobileClient } from '~/util/client';

import HomeIcon from '@/assets/icons/home.svg';
import SettingsIcon from '@/assets/icons/settings.svg';

import LanguageSwitch from '~/components/LanguageSwitch';
import PlatformIconBar from '~/components/PlatformIconBar';
import AccountOverview from './AccountOverview';
import MenuItem from './MenuItem';

import { logTrackerEvent } from '@/util/EventLogger';

const MENU_ITEMS = [
  {
    section: 'primary',
    items: [
      {
        key: 'civicLiker',
        to: { name: 'in-civic' },
      },
      {
        key: 'earnLikeCoin',
        to: { name: 'in-creator' },
      },
      {
        key: 'settings',
        to: { name: 'in-settings' },
        icon: SettingsIcon,
        isRegistered: true,
      },
    ],
  },
  {
    section: 'secondary',
    items: [
      {
        key: 'aboutLikeCoin',
        to: { name: 'in-about' },
      },
      {
        key: 'whitepaper',
        to: { name: 'in-whitepaper' },
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
  components: {
    AccountOverview,
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
      SettingsIcon,
      slidingMenuStyle: {
        height: '100vh',
      },
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserIsRegistered',
      'getIsSlidingMenuOpen',
    ]),
  },
  watch: {
    getIsSlidingMenuOpen(isOpen) {
      if (isOpen && checkIsMobileClient()) {
        // Fix view port unit issue in mobile device
        this.slidingMenuStyle.height = `${window.innerHeight}px`;
      }
    },
  },
  methods: {
    ...mapActions([
      'setAuthDialog',
      'popupAuthDialogInPlace',
      'logoutUser',
      'closeSlidingMenu',
    ]),
    onClickSignInButton() {
      logTrackerEvent(this, 'RegFlow', 'ClickSlidingMenuSignIn', 'ClickSlidingMenuSignIn', 1);
      if (this.$route.name === 'index') {
        this.setAuthDialog({ isShow: true, isSignIn: true });
      } else {
        this.popupAuthDialogInPlace({ route: this.$route, isSignIn: true });
      }
    },
    onClickSignUpButton() {
      logTrackerEvent(this, 'RegFlow', 'ClickSlidingMenuSignUp', 'ClickSlidingMenuSignUp', 1);
      if (this.$route.name === 'index') {
        this.setAuthDialog({ isShow: true });
      } else {
        this.popupAuthDialogInPlace({ route: this.$route });
      }
    },
    async onClickLogoutButon() {
      await this.logoutUser();
      this.$nextTick(() => this.$router.push('/'));
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

  hr {
    border: none;
    border-top: 2px solid $like-green;
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
  padding: 52px 24px 36px 52px;

  @media (max-width: 600px) {
    padding: 32px 24px 36px 32px;
  }

  &.main {
    flex-grow: 1;
  }

  .menu {
    ul {
      margin: -10px;
      padding: 0;

      list-style: none;

      li {
        padding: 8px;

        @media (max-width: 600px) {
          padding: 6px;
        }

        .menu-item {
          &__icon {
            width: 16px;
            height: 16px;
            margin-left: 4px;

            /deep/ svg {
              fill: $like-gray-4 !important;
            }
          }
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
