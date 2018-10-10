<template>
  <div class="lc-layout">

    <tool-bars />

    <div class="lc-page-wrapper with-sliding-menu">

      <sliding-menu />

      <div class="lc-page-content">
        <nuxt />
      </div>

      <footer class="lc-page-footer lc-page-footer--no-margin">
        <div class="lc-container-0">
          <my-footer />
        </div>
      </footer>

    </div>

    <div class="social-links-container lc-mobile-hide">
      <div class="lc-container-0">
        <div class="lc-container-1">
          <div class="platform-icon-bar-wrapper">
            <div>
              <div>
                <platform-icon-bar
                  :isVertical="true"
                  size="medium"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <no-ssr>
      <portal-target name="light-box" />
    </no-ssr>

  </div>
</template>


<script>
import { mapGetters } from 'vuex';

import MyFooter from '~/components/footer/Footer';
import PlatformIconBar from '~/components/PlatformIconBar';
import SlidingMenu from '~/components/SlidingMenu/index';
import ToolBars from '~/components/toolbars/ToolBars';

export default {
  components: {
    MyFooter,
    PlatformIconBar,
    SlidingMenu,
    ToolBars,
  },
  computed: {
    ...mapGetters([
      'getCurrentLocale',
      'getCurrentLocaleISO',
    ]),
  },
  head() {
    return {
      htmlAttrs: {
        lang: this.getCurrentLocaleISO,
      },
      bodyAttrs: {
        'lc-lang': this.getCurrentLocale,
      },
    };
  },
};
</script>

<style lang="scss" scoped>

.social-links-container {
  position: fixed;
  z-index: 3;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  pointer-events: none;

  .platform-icon-bar-wrapper {
    position: relative;

    height: 100%;

    > div {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;

      > div {
        display: flex;
        align-items: center;

        height: 100%;
        margin-left: 12px;

        @media (max-width: 768px) {
          margin-left: 4px;
        }

        :global(> div) {
          pointer-events: auto;
        }
      }
    }
  }
}
</style>
