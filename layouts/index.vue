<template>
  <div class="lc-layout">

    <div class="lc-page-wrapper with-sliding-menu">

      <sliding-menu />

      <div class="lc-page-content">
        <nuxt/>
      </div>

      <footer class="lc-page-footer">
        <div class="lc-container-0">
          <my-footer/>
        </div>
      </footer>

    </div>

    <div class="social-links-container lc-mobile-hide">
      <div class="lc-container-0">
        <div class="lc-container-1">
          <div class="platform-icon-bar-wrapper">
            <div>
              <div>
                <platform-icon-bar :isVertical="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import { mapGetters } from 'vuex';

import MyFooter from '~/components/footer/Footer';
import PlatformIconBar from '~/components/PlatformIconBar';
import SlidingMenu from '~/components/SlidingMenu/index';

export default {
  components: {
    MyFooter,
    PlatformIconBar,
    SlidingMenu,
  },
  computed: {
    ...mapGetters([
      'getCurrentLocale',
    ]),
  },
  head() {
    return {
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
