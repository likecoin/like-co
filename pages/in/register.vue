<template>
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
              <like-register-form :isEdit="isEdit" :redirect="redirect" />
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import Description from '~/components/Description';
import Introduction from '~/components/Introduction';
import LikeRegisterForm from '~/components/LikeRegisterForm';

import { apiGetUserById } from '@/util/api/api';
import * as types from '@/store/mutation-types';
import { REDIRECT_WHITE_LIST } from '@/constant';

const URL = require('url-parse');

export default {
  name: 'Register',
  layout: 'defaultWithHeader',
  components: {
    Description,
    Introduction,
    LikeRegisterForm,
  },
  data() {
    return {
      referrer: '',
      redirect: '',
    };
  },
  asyncData({ query, store, redirect }) {
    if (store.getters.getUserIsRegistered) {
      redirect({ name: 'in-edit' });
      return {};
    }
    let queryRedirect = '';
    if (query.redirect) {
      try {
        const url = new URL(query.redirect);
        if (!url.host || REDIRECT_WHITE_LIST.indexOf(url.host) === -1) {
          throw new Error(`${url.host} Not whitelisted`);
        }
        queryRedirect = query.redirect;
      } catch (err) {
        console.error(err);
      }
    }
    const title = 'Register.header.title';
    const subtitle = 'Register.label.register';
    store.commit(types.UI_HEADER_UPDATE, {
      title,
      subtitle,
      icon: '',
    });
    const referrer = '';
    const referrerId = query.from;
    if (referrerId) {
      return apiGetUserById(referrerId)
        .then((res) => {
          const { displayName } = res.data;
          return { referrer: displayName || referrerId, redirect: queryRedirect };
        })
        .catch(() => ({ referrer }));
    }
    return { referrer, redirect: queryRedirect };
  },
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.title,
        },
      ],
    };
  },
  computed: {
    title() {
      return this.referrer ? this.$t('Register.header.titleReferral', { name: this.referrer }) : this.$t('Register.header.title');
    },
    ...mapGetters({
      isEdit: 'getUserIsRegistered',
      getDesc: 'getDesc',
      getHeaderSubtitle: 'getHeaderSubtitle',
      getHeaderIcon: 'getHeaderIcon',
      getHeaderTitle: 'getHeaderTitle',
    }),
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/index";
@import "~assets/default";

.like-register-form-wrapper {
  @media (max-width: 600px) {
    margin-top: -24px;
  }

  .lc-container-header-title {
    margin: 0;

    @media (min-width: 769px) {
      width: calc(66.66% - 88px);
    }
  }
}

</style>
