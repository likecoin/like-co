<template>
  <div class="checkout-form">

    <div
      v-if="chargeId"
      class="purchased-receipt lc-padding-vertical-32 lc-text-align-center"
    >
      <p class="lc-margin-bottom-24">
        {{
          $t(
            'BackerPage.productList.label.youHavePurchased',
            { email: email, product: getLocalized(product.name)},
          )
        }}
        <span class="reference-number lc-font-size-24">
          {{ chargeId }}
        </span>
      </p>
      <div
        v-if="getUserIsRegistered"
        class="lc-padding-vertical-32"
      >
        <material-button
          style="max-width: 200px"
          @click="reset(true)"
        >
          {{ $t('General.button.ok') }}
        </material-button>
      </div>
      <div
        v-else
        class="lc-padding-vertical-32"
      >
        <p class="lc-margin-bottom-24">
          {{ $t('BackerPage.label.notRegistered') }}
        </p>
        <material-button
          style="max-width: 200px"
          @click="gotoRegister"
        >
          {{ $t('BackerPage.button.register') }}
        </material-button>
      </div>
    </div>

    <div
      v-else
      class="product-list"
    >
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
          @click="onClickProduct(p.id)"
        >
          <div>

            <div class="product-preview">
              <div :style="{ backgroundImage: `url(${p.image})` }" />
            </div>

            <div class="product-details">

              <div class="info-wrapper">
                <h1 class="name">{{ getLocalized(p.name) }}</h1>
                <p
                  class="description"
                  v-html="getLocalized(p.description)"
                />
              </div>

              <div class="price">{{ p.amount / 100 }}</div>

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
  name: 'checkout-form',
  components: {
    MaterialButton,
  },
  data() {
    return {
      products: [],
      product: {},
      chargeId: '',
      email: '',
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserIsRegistered',
    ]),
  },
  mounted() {
    this.queryIAP();
  },
  methods: {
    ...mapActions([
      'purchaseIAP',
      'queryIAPProducts',
    ]),
    async queryIAP() {
      this.products = await this.queryIAPProducts();
    },
    getLocalized(t) {
      return t[this.$i18n.locale] || t[this.$i18n.fallbackLocale];
    },
    gotoRegister() {
      this.$router.push({ name: 'in-register', query: { ref: 'in-backer', ...this.$route.query } });
    },
    async onClickProduct(id) {
      if (this.getUserIsRegistered && !this.getUserInfo.isEmailVerified) {
        this.$emit('emailNotVerified');
        return;
      }
      this.product = this.products.find(p => p.id === id);
      const {
        user,
        wallet,
        email,
        isEmailVerified,
      } = this.getUserInfo;
      let stripeEmail = '';
      if (email && isEmailVerified) stripeEmail = email;
      this.$checkout.open({
        name: this.getLocalized(this.product.name),
        currency: 'USD',
        amount: this.product.amount,
        email: stripeEmail,
        token: async (token) => {
          const payload = {
            user,
            from: wallet,
            token,
          };
          const res = await this.purchaseIAP({ id, payload });
          this.email = token.email;
          this.product = res.product;
          this.chargeId = res.receiptNumber || res.chargeId;
        },
      });
    },
    reset() {
      this.chargeId = '';
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/index";

$product-item-radius: 8px;

.purchased-receipt {
  .reference-number {
    display: block;

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
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;

    margin: 0;
    margin: -8px;
    padding: 0;

    list-style: none;

    li {
      position: relative;

      flex-shrink: 0;

      width: 100%;
      min-width: 164px;
      padding: 8px;

      &.dummy {
        height: 198px;

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
        > div {
          position: relative;

          display: flex;

          cursor: pointer;
          transition: box-shadow, transform .2s ease-out;

          border-radius: $product-item-radius;
          background-color: white;
          box-shadow: 0 0 0 0px $like-green;

          @media (max-width: 600px) {
            flex-direction: column;

            max-width: 240px;margin-right: auto;
            margin-left: auto;
          }

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

      .product-preview {
        position: relative;

        overflow: hidden;
        flex-shrink: 0;

        width: 100%;
        max-width: 240px;
        min-height: 240px;

        border-radius: $product-item-radius 0px 0px $product-item-radius;
        background-image: linear-gradient(250deg, #FFDFD2, #C1F3F5);

        @media (max-width: 600px) {
          border-radius: $product-item-radius $product-item-radius 0px 0px;
        }

        > div {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;

          background-position: center;
          background-size: cover;
        }
      }

      .product-details {
        position: relative;

        display: flex;
        overflow: hidden;
        flex-direction: column;
        flex-grow: 1;

        border-radius: 0px $product-item-radius $product-item-radius 0px;

        @media (max-width: 600px) {
          border-radius:  0px 0px $product-item-radius $product-item-radius;
        }

        .info-wrapper {
          flex-grow: 1;

          padding: 16px 20px 12px;

          .name {
            min-height: 44px;

            font-size: 16px;
            font-weight: 600;
            line-height: 1.35;
          }

          .description {
            margin-top: 4px;

            color: $like-gray-4;

            font-size: 14px;
            line-height: 1.35;
          }
        }
      }

      .price {
        padding: 4px 32px;

        text-align: right;

        color: $like-green;
        background-image: linear-gradient(254deg, #ffdfd2, #c1f3f5);

        font-size: 30px;
        font-weight: 600;
        line-height: 40px;

        &::before {
          margin-right: 8px;

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
