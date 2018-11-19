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
  watch: {
    getUserInfo(user, prevUser) {
      if (!prevUser.wallet && user.wallet) {
        this.$router.push({ name: 'in-settings-button' });
      }
    },
  },
  methods: {
    ...mapActions([
      'setWalletNoticeDialog',
      'linkWalletToUser',
      'setPopupError',
    ]),
    onClickStart() {
      if (this.getUserIsRegistered) {
        if (this.getUserInfo.wallet) {
          this.$router.push({ name: 'in-settings-button' });
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
