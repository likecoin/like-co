<template>
  <div class="checkout-form">

    <div v-if="chargeId" class="purchased-receipt lc-padding-vertical-32 lc-text-align-center">
      <p class="lc-margin-bottom-24">
        {{ $t('LikeBundle.purchaseLikeBundle.label.youHavePurchased', { product: product.name }) }}
        <span class="reference-number lc-font-size-24">
          {{ chargeId }}
        </span>
      </p>
      <material-button
        style="max-width: 200px"
        @click="reset(true)">
        {{ $t('General.button.ok') }}
      </material-button>
    </div>

    <div v-else class="product-list">
      <ul v-if="products.length < 1">
        <li class="dummy" />
        <li class="dummy" />
        <li class="dummy" />
      </ul>
      <ul v-else>
        <li
          v-for="p in products"
          :key="p.id"
          class="product"
          @click="onClick(p.id)">
          <div>
            <div class="like-coin-amount">
              <div>
                {{ p.likeCoinAmount }}
              </div>
            </div>
            <div class="price">
              {{ p.amount / 100 }}
            </div>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import MaterialButton from '~/components/MaterialButton';

export default {
  name: 'checkoutForm',
  components: {
    MaterialButton,
  },
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
      if (!this.getUserInfo.isEmailVerified) {
        this.$emit('emailNotVerified');
        return;
      }
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
    reset() {
      this.chargeId = '';
    },
  },
  mounted() {
    this.queryIAP();
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/index";

$product-item-radius: 8px;

.purchased-receipt {
  .reference-number {
    display: block;

    width: 300px;
    min-width: 200px;
    max-width: 100%;
    margin: 24px auto 32px;
    padding: 10px 20px;

    color: $like-green;
    border-radius: $product-item-radius;
    background-color: lighten($like-light-blue, 15%);

    font-family: monospace;
  }
}

.product-list {
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    margin: 0;
    margin: -8px;
    padding: 0;

    list-style: none;

    li {
      position: relative;

      flex-shrink: 0;

      width: #{100% / 3};
      min-width: 164px;
      padding: 8px;

      &.dummy {
        height: 244px;

        @keyframes flash-bg {
          0% { background-color: $like-gray-2; }
          50% { background-color: $like-gray-3; }
          90% { background-color: $like-gray-2; }
          100% { background-color: $like-gray-2; }
        }

        &::before {
          display: block;

          width: 100%;
          height: 100%;

          content: " ";
          animation-name: flash-bg;
          animation-duration: 2.5s;
          animation-iteration-count: infinite;

          border-radius: $product-item-radius;
        }

        @for $i from 1 through 3 {
          &:nth-child(3n + #{$i})::before {
            animation-delay: #{$i * 1 / 3 - 1}s;
          }
        }
      }

      &:not(.dummy) {
        &:nth-child(3n + 1) {
          .like-coin-amount > div{
            background-image: linear-gradient(244deg, #DEE9E4, #C1F3F5);
          }
        }

        &:nth-child(3n + 2) {
          .like-coin-amount > div {
            background-image: linear-gradient(244deg, #F0E4DC, #DAEBE6);
          }
        }

        &:nth-child(3n + 3) {
          .like-coin-amount > div {
            background-image: linear-gradient(244deg, #ffdfd2, #EBE5DF);
          }
        }

        > div {
          position: relative;

          cursor: pointer;
          transition: box-shadow, transform .2s ease-out;

          border-radius: $product-item-radius;
          background-color: white;
          box-shadow: 0 0 0 0px $like-green;

          &:hover {
            z-index: 1;

            transform: translateY(-2px);

            box-shadow: 0 0 0 3px $like-green;

            &::before {
              box-shadow: 0 4px 10px 3px rgba(0, 0, 0, 0.4);
            }
          }

          &:active {
            transform: translateY(0);

            &::before {
              box-shadow: 0 2px 6px 2px rgba(0, 0, 0, 0.6);
            }
          }

          &::before {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;

            content: " ";
            transition: box-shadow .2s ease-out;

            border-radius: $product-item-radius;
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.0);
          }
        }
      }

      .like-coin-amount {
        position: relative;

        padding-top: 100%;

        > div {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;

          padding: 42px 16px 22px;

          text-align: center;

          color: $like-green;
          border-top-left-radius: $product-item-radius;
          border-top-right-radius: $product-item-radius;

          font-size: 38px;
          line-height: 52px;

          &::after {
            display: block;

            content: "LIKE";

            color: $like-gray-5;

            font-size: 16px;
            line-height: 22px;
          }
        }
      }

      .price {
        padding: 22px 8px 16px;

        text-align: center;

        color: $like-dark-brown-2;

        font-size: 30px;
        font-weight: 600;
        line-height: 40px;

        &::before {
          content: "USD";

          font-size: 12px;
          font-weight: 400;
          line-height: 16px;
        }
      }
    }
  }
}
</style>
