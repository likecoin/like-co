<template>
  <div class="bundlesale-page">

    <div class="lc-container-0 lc-narrow">

      <section class="lc-container-1 lc-section-block">
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4 ">

              <nav class="nav-menu">
                <span>
                  <nuxt-link :to="{ name: 'in-whitepaper' }">
                    {{ $t('TokenSale.button.whitePaper') }}
                  </nuxt-link>
                </span>

                <img class="like-coin-token" :src="likeCoinIcon" />

                <span>
                  <nuxt-link to="/">
                    {{ $t('TokenSale.button.aboutLikeCoin') }}
                  </nuxt-link>
                </span>
              </nav>

            </div>
          </div>
        </div>

        <div class="lc-container-2-extend">
          <div class="lc-container-3-extend-bg" />
          <div class="lc-container-3">
            <div class="lc-padding-top-32 lc-padding-bottom-16">

              <section class="lc-text-align-center">
                <h1 class="lc-font-size-42 lc-font-weight-600">
                  {{ $t('TokenSale.preSaleTitle') }} <span class="lc-font-weight-300 lc-color-like-green">LIVE</span>
                </h1>
                <h2 class="lc-margin-top-12 lc-font-size-38 lc-font-weight-300">
                  {{ $t('TokenSale.label.bonusAndLimitedOffer') }}
                </h2>
                <h3 class="lc-margin-top-12 lc-font-size-14 lc-font-weight-400">
                  {{ $t('TokenSale.label.limitedOfferCondition') }}
                </h3>
              </section>

            </div>
          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4 lc-padding-vertical-32 lc-text-align-center">
              {{ $t('TokenSale.label.amountWillBeSentWhenSalesStart')}}
            </div>
          </div>
        </div>
      </section>

      <section class="lc-container-1 lc-verticle-inset-3">
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4 lc-padding-vertical-24">
              <checkoutForm />
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex';

import checkoutForm from '~/components/checkoutForm';

import likeCoinIcon from '@/assets/like-coin.svg';
import EthHelper from '@/util/EthHelper';

export default {
  name: 'bundlesale',
  layout: 'narrowWithHeader',
  components: {
    checkoutForm,
  },
  data() {
    return {
      likeCoinIcon,
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
    ]),
  },
  methods: {
    async checkStatus() {
      if (this.getUserIsRegistered) {
        this.isKYCTxPass = await EthHelper.queryKYCStatus(this.getLocalWallet);
      } else {
        this.isKYCTxPass = null;
      }
    },
  },
  head() {
    return {
      title: this.$t('Transaction.head.title'),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('Transaction.head.title'),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('Transaction.head.description'),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('Transaction.head.description'),
        },
      ],
    };
  },
  watch: {
    getUserIsFetching(f) {
      if (!f) {
        this.checkStatus();
      }
    },
  },
  mounted() {
    if (!this.getUserIsFetching) this.checkStatus();
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/index";

.lc-container-3 {
  background-color: $like-gray-1;
}

.bundlesale-page {
  margin-bottom: 18px;

  ul {
    padding: 0;

    list-style-type: none;
  }

  li {
    display: inline-block;

    margin: 0 10px;
  }

  a {
    cursor: pointer;
    transition: opacity, color .2s ease-in-out;

    color: #28646e;
  }
}

.nav-menu {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding-top: 16px;

  @media (max-width: 600px) {
    flex-direction: column;
  }

  .like-coin-token {
    z-index: 1;

    width: 144px;
    height: 144px;
    margin: 16px;
    margin-bottom: -16px;

    @media (min-width: 769px) {
      margin-top: -32px;
    }
    @media (max-width: 600px) {
      order: 999;
    }
  }

  span {
    flex: 1;

    a {
      text-decoration: underline;

      color: #28646E;
    }

    &:last-child {
      text-align: right;
    }
  }
}
</style>
