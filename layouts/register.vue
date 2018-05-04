<template>
  <div class="lc-layout">
    <tool-bars />

    <div class="lc-page-wrapper with-sliding-menu">

      <sliding-menu />

      <header class="lc-page-header">
        <div class="lc-container-0">
          <div class="lc-container-1">
            <div class="underlay lc-mobile-hide" />
            <div class="lc-container-2">
              <site-header/>
            </div>
          </div>
        </div>
      </header>

      <div class="lc-page-content">
        <div class="register-page lc-padding-bottom-32">
          <div class="lc-container-0">

            <div class="lc-container-1">
              <div class="upper-left-corner lc-mobile-hide" />
              <div class="lc-container-2 lc-padding-top-48 lc-padding-top-0-mobile">
                <introduction
                  class="lc-container-3"
                  :title="getHeaderTitle"
                  :icon="getHeaderIcon" />
                <Description
                  class="lc-mobile-hide"
                  :content="getDesc"
                  :showButton="false"
                />
              </div>
            </div>

            <div class="lc-container-1 like-register-form-wrapper lc-margin-top-48">

              <div class="lc-container-header">
                <div class="lc-container-2 lc-container-header-overlay">
                  <div class="lc-container-3 lc-bg-gray-1" />
                </div>
                <div class="lc-container-2">
                  <div class="lc-container-3">
                    <div class="lc-container-4">
                      <div class="lc-container-header-title">
                        <h1 class="lc-font-size-32 lc-mobile">
                          {{ $t(getHeaderSubtitle || title) }}
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="lc-container-2">
                <div class="lc-container-3 lc-padding-vertical-32 lc-mobile lc-bg-gray-1">
                  <div class="lc-container-4">
                    <nuxt />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <footer class="lc-page-footer">
        <div class="lc-container-0">
          <my-footer/>
        </div>
      </footer>

    </div>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import MyFooter from '~/components/footer/Footer';
import SiteHeader from '~/components/header/HeaderWithMenuButton';
import SlidingMenu from '~/components/SlidingMenu/index';
import ToolBars from '~/components/toolbars/ToolBars';

import Description from '~/components/Description';
import Introduction from '~/components/Introduction';


export default {
  data() {
    return {
      title: 'Register.label.registerRedeem',
    };
  },
  components: {
    ToolBars,
    MyFooter,
    SiteHeader,
    SlidingMenu,
    Introduction,
    Description,
  },
  computed: {
    ...mapGetters([
      'getUserIsReady',
      'getUserIsRegistered',
      'getUserNeedAuth',
      'getDesc',
      'getHeaderSubtitle',
      'getHeaderIcon',
      'getHeaderTitle',
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
  methods: {
    ...mapActions([
      'loginUser',
    ]),
    async triggerLoginSign() {
      if (!(await this.loginUser())) {
        this.$router.go(-1);
      } else {
        this.redirectToUserPage();
      }
    },
    redirectToUserPage() {
      const { query } = this.$route;
      if (query.ref) {
        const newQuery = Object.assign({}, query);
        delete newQuery.ref;
        if (newQuery.from) delete newQuery.from;
        this.$router.push({ name: query.ref, query: newQuery });
      } else {
        this.$router.push({ name: 'in' });
      }
    },
  },
  watch: {
    getUserNeedAuth(a) {
      if (a) this.triggerLoginSign();
    },
    getUserIsRegistered(u) {
      if (u) this.redirectToUserPage();
    },
  },
  mounted() {
    if (this.getUserIsRegistered) {
      this.redirectToUserPage();
    } else if (this.getUserNeedAuth) {
      this.triggerLoginSign();
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/default";

.like-register-form-wrapper {
  @media (max-width: 600px) {
    margin-top: -24px;
  }
}
</style>
