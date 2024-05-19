<template>
  <div style="display: flex; justify-content: center; margin-bottom: 12px">
    <Button
      v-if="!getAddress"
      @click="onClickLoginButton"
    >{{ $t('AuthDialog.SignUp.toggleButton') }}
    </Button>
  </div>
</template>
<script>
import wallet from '~/mixins/wallet-login';
import { mapGetters } from 'vuex';
import Button from '~/components/v2/Button';

export default {
  name: 'in-register',
  layout: 'register',
  components: {
    Button,
  },
  mixins: [wallet],
  head() {
    return {
      title: this.$t('Register.label.register'),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('Register.label.register'),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('Register.header.title'),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('Register.header.title'),
        },
      ],
      link: [
        { rel: 'canonical', href: '/in/register' },
      ],
    };
  },
  computed: {
    ...mapGetters(['getAddress', 'getSigner']),
  },
  watch: {
    getAddress: {
      immediate: true,
      handler(getAddress) {
        if (getAddress) {
          this.$router.push({ name: 'in-settings', query: { wallet: getAddress } });
        }
      },
    },
  },
  methods: {
    async onClickLoginButton() {
      await this.connectWallet();
    },
  },
};
</script>
