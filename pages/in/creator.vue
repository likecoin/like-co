<template>
  <div class="earn-page">
    <div class="lc-container-1">
      <div class="lc-container-2">
        <div class="lc-container-3 lc-container-no-padding-mobile">
          <like-button-intro
            class="lc-margin-top-48"
            @start="onClickStart"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import UserUtil from '@/util/User';
import {
  checkIsMobileClient,
  checkIsTrustClient,
} from '~/util/client';

import LikeButtonIntro from '~/components/LikeButtonIntro';
import EthMixin from '~/components/EthMixin';

export default {
  name: 'earn-page',
  components: {
    LikeButtonIntro,
  },
  mixins: [EthMixin],
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
      'getLocalWallet',
      'getUserInfo',
    ]),
  },
  head() {
    return {
      title: this.$t('LikeButtonIntro.title.earn'),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('LikeButtonIntro.title.earn'),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('LikeButtonIntro.label.earn'),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('LikeButtonIntro.label.earn'),
        },
      ],
    };
  },
  watch: {
    getUserInfo(user, prevUser) {
      if (!prevUser.wallet && user.wallet) {
        this.$router.push({ name: 'in-creator' });
      }
    },
  },
  mounted() {
    const { action, ...query } = this.$route.query;
    if (this.$route.query.action === 'start') {
      this.onClickStart();
      this.$router.push({ ...this.$route, query });
    }
  },
  methods: {
    ...mapActions([
      'setWalletNoticeDialog',
      'linkWalletToUser',
      'setPopupError',
      'openPopupDialog',
    ]),
    onClickStart() {
      if (this.getUserIsRegistered) {
        if (this.getUserInfo.wallet) {
          this.$router.push({ name: 'in-settings-button' });
        } else if (checkIsMobileClient() && !checkIsTrustClient(this)) {
          this.openPopupDialog({
            allowClose: true,
            header: this.$t('LikeButtonIntro.setupWallet'),
            message: this.$t('Error.REQUIRED_DESKTOP_CHROME'),
            confirmText: this.$t('General.button.confirm'),
          });
        } else {
          this.setWalletNoticeDialog({
            isShow: true,
            onConfirm: () => this.startWeb3AndCb(this.bindWallet),
          });
        }
      }
    },
    async bindWallet() {
      let payload;
      try {
        payload = await UserUtil.formatAndSignUserInfo(
          {
            wallet: this.getLocalWallet,
            user: this.getUserInfo.user,
          },
          this.$t('Sign.Message.registerUser'),
        );
      } catch (err) {
        if (err.message.indexOf('Invalid "from" address') >= 0) {
          // User has logout MetaMask after EthHelper initialization
          this.startWeb3AndCb(this.bindWallet, true);
        } else if (err.message.indexOf('User denied message signature') >= 0) {
          // User denied signing
        } else {
          this.setPopupError('Unable to bind wallet');
        }
      }

      if (payload) {
        payload.user = this.getUserInfo.user;
        this.linkWalletToUser(payload);
      }
    },
  },
};
</script>
