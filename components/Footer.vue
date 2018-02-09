<template>
  <footer>
    <span class="contractAddr md-xsmall-hide">LikeCoin Contract: <a :href="getAddress" target="_blank">{{ contractAddress }}</a></span>
    <span class="center">Visit our website for more information: <a href="https://likecoin.foundation/" target="_blank">likecoin.foundation</a></span>
    <span class="right md-medium-hide" />
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
        const { user, displayName, email } = e;
        const opt = {};
        if (user) opt.user_id = user;
        if (displayName) opt.name = displayName;
        if (email) opt.email = email;
        this.$intercom.update(opt);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/index";

footer {
  position: fixed;
  z-index: 4;
  bottom: 0;

  width: 100%;
  padding: 12px;

  background-color: $like-white;
  display: flex;

  .contractAddr, .right {
    flex: 1;
    text-align: left;
    font-size: 10px;
    a {
      color: #28646E;
    }
  }
  .center {
    flex: 1;
    text-align: center;
  }
}
</style>
