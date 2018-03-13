<template>
  <footer>
    <div class="lc-container-1">
      <div class="lc-container-2">
        <div class="lc-content-wrapper">

          <span class="contract-address md-xsmall-hide">{{ $t('Footer.label.contract') }}<a :href="getAddress" target="_blank" rel="noopener">{{ contractAddress }}</a></span>

          <div class="right footer-links">
            <!-- <a href="http://lakoo.org">{{ $t('Footer.button.aboutFoundation') }}</a> -->
            <a href="http://intercom.help/likecoin">{{ $t('Footer.button.support') }}</a>
          </div>

        </div>
      </div>
    </div>
  </footer>
</template>
<script>
import { mapGetters } from 'vuex';
import { ETHERSCAN_HOST } from '@/constant';
import { LIKE_COIN_ADDRESS } from '@/constant/contract/likecoin';

export default {
  data() {
    return {
      contractAddress: LIKE_COIN_ADDRESS,
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
    ]),
    getAddress() {
      return `${ETHERSCAN_HOST}/address/${this.contractAddress}`;
    },
  },
  mounted() {
    if (this.$intercom) {
      const { user, displayName, email } = this.getUserInfo;
      const opt = {};
      if (user) opt.user_id = user;
      if (displayName) opt.name = displayName;
      if (email) opt.email = email;
      this.$intercom.boot(opt);
    }
  },
  watch: {
    getUserInfo(e) {
      if (this.$intercom) {
        const {
          user,
          displayName,
          email,
          wallet,
        } = e;
        const opt = { LikeCoin: true };
        if (user) opt.user_id = user;
        if (displayName) opt.name = displayName;
        if (email) opt.email = email;
        if (wallet) opt.wallet = wallet;
        this.$intercom.update(opt);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/index";

footer {
  position: relative;
  padding: 12px 0;
  width: 100%;

  background-color: $like-white;
  border-top: 0;

  // Gradient separator
  &::before {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 100%;
    height: 2px;

    content: " ";
    background-image: linear-gradient(269deg, #d2f0f0, #f0e6b4);
  }

  .lc-content-wrapper {
    display: flex;
    justify-content: space-between;
  }

  .contract-address {
    text-align: left;
    font-size: 10px;

    a {
      color: #28646E;
    }
  }

  .footer-links {
    display: flex;
    flex-wrap: wrap;
    margin-left: 24px;

    // Prevent overlapping with Intercom button
    @media (max-width: 1647px) {
      margin-right: 64px;
    }
    @media (max-width: 1024px) {
      margin-right: 108px;
    }
    @media (max-width: 768px) {
      flex-direction: column;
    }

    > a {
      display: block;
      color: #6B6B6B;
      font-size: 12px;
      font-weight: 400;
      text-align: left;

      &:not(:last-child) {
        margin-right: 24px;
      }
    }
  }
}
</style>
