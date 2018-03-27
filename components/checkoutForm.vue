<template>
  <div v-if="chargeId">
    You have purchased {{ product.name }}, ref id: {{ chargeId }}
  </div>
  <div v-else>
    <div v-for="p in products" :key="p.id">
      <md-button @click="onClick(p.id)">{{ p.name }} : {{ p.description }}</md-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'checkoutForm',
  data() {
    return {
      products: [],
      product: {},
      chargeId: '',
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
    ]),
  },
  methods: {
    ...mapActions([
      'purchaseIAP',
      'queryIAPProducts',
    ]),
    async queryIAP() {
      this.products = await this.queryIAPProducts();
    },
    async onClick(id) {
      this.product = this.products.find(p => p.id === id);
      const {
        user,
        wallet,
        email,
      } = this.getUserInfo;
      this.$checkout.open({
        name: this.product.name,
        currency: 'USD',
        amount: this.product.amount,
        email,
        token: async (token) => {
          const payload = {
            user,
            from: wallet,
            email,
            token: token.id,
          };
          const res = await this.purchaseIAP({ id, payload });
          this.product = res.product;
          this.chargeId = res.chargeId;
        },
      });
    },
  },
  mounted() {
    this.queryIAP();
  },
};
</script>