<template>
  <div class="payment-page">
    <div class="lc-container-0 lc-narrow">

      <section class="lc-container-1 lc-section-block">

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 ">

              <narrow-page-header
                :icon="avatar"
                :avatar-halo="avatarHalo"
              />

            </div>
          </div>
        </div>

        <div :class="['lc-container-2-extend', { ether: isEth }]">
          <div class="lc-container-3-extend-bg" />
          <div class="lc-container-3">
            <div class="lc-padding-top-32 lc-padding-bottom-16">
              <section class="lc-text-align-center">
                <i18n
                  path="Transaction.label.sendTo"
                  tag="h1"
                  class="lc-font-size-42 lc-font-weight-300 lc-mobile"
                >
                  <span place="coin">{{ isEth ? 'ETH' : 'LikeCoin' }}</span>
                  <span
                    place="title"
                    class="usertitle"
                  >{{ displayName }}</span>
                </i18n>
              </section>

            </div>
          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-vertical-32">
              <social-media-connect
                :limit="5"
                :username="id"
                :platforms="platforms"
                class="lc-margin-bottom-16"
                type="readonly"
                center
              />

              <section
                v-if="id"
                class="address-container"
              >

                <div class="address-title">
                  {{ $t('Transaction.label.recipientId') }}
                </div>
                <div class="address-content">
                  {{ id }}
                </div>
              </section>
              <section
                v-if="wallet"
                class="address-container"
              >
                <div class="address-title">
                  {{ $t('Transaction.label.recipientAddress') }}
                </div>
                <div class="address-content">
                  {{ maskedWallet }}
                </div>
              </section>

            </div>
          </div>
        </div>

      </section>

      <!-- BEGIN - Send LikeCoin Section -->
      <section class="lc-container-1 lc-section-block">

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-top-24 lc-padding-bottom-32">
              <a
                :href="getLikerLandAppURL"
              >{{ $t('Home.App.button') }}</a>
            </div>
          </div>
        </div>

      </section>
      <!-- END - Send LikeCoin Section -->

    </div>
  </div>
</template>


<script>
import NarrowPageHeader from '~/components/header/NarrowPageHeader';
import SocialMediaConnect from '~/components/SocialMediaConnect';

import User from '@/util/User';
import {
  apiGetUserMinById,
  apiGetSocialListById,
  getLikerLandAppURL,
} from '@/util/api/api';

import { LIKE_COIN_ICO_ADDRESS } from '@/constant/contract/likecoin-ico';


function formatAmount(amount) {
  let result = amount.toString().replace(/[^0-9.]/, '');
  if (!result) {
    result = '0.00';
  }
  const dotIndex = result.indexOf('.');
  if (dotIndex === -1) {
    result = `${result}.00`;
  } else if (dotIndex === 0) {
    result = `0${result}`;
  }
  const decimals = result.length - result.indexOf('.') - 1;
  if (decimals < 2) {
    const paddingZeros = '00'.substr(0, 2 - decimals);
    result = `${result}${paddingZeros}`;
  }
  return result;
}


export default {
  name: 'payment',
  layout: 'narrowWithHeader',
  components: {
    NarrowPageHeader,
    SocialMediaConnect,
  },
  data() {
    return {
      platforms: {},
    };
  },
  async asyncData({
    route,
    params,
    query,
    redirect,
    error,
  }) {
    if (params.id !== params.id.toLowerCase()) {
      redirect({ name: route.name, params: { ...params, id: params.id.toLowerCase() }, query });
    }
    return Promise.all([
      apiGetUserMinById(params.id),
      apiGetSocialListById(params.id).catch(() => ({})),
    ]).then((res) => {
      const {
        wallet,
        cosmosWallet,
        avatar,
        displayName,
      } = res[0].data;
      const amount = formatAmount(params.amount || 1);
      if (wallet === LIKE_COIN_ICO_ADDRESS) {
        redirect({
          name: 'in-tokensale',
        });
      }
      return {
        wallet: cosmosWallet || wallet,
        avatar,
        id: params.id,
        displayName: displayName || params.id,
        amount,
        avatarHalo: User.getAvatarHaloType(res[0].data),
        platforms: res[1].data,
      };
    }).catch((e) => { // eslint-disable-line no-unused-vars
      error({ statusCode: 404, message: '' });
    });
  },
  head() {
    return {
      title: this.$t('Transaction.head.title', { name: this.displayName }),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('Transaction.head.title', { name: this.displayName }),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('Transaction.head.description', { name: this.displayName }),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('Transaction.head.description', { name: this.displayName }),
        },
        {
          hid: 'og_image',
          property: 'og:image',
          content: 'https://like.co/images/og/tokensale.jpg',
        },
      ],
      script: [
        {
          hid: 'schema',
          innerHTML: JSON.stringify({
            '@context': 'http://www.schema.org',
            '@type': 'Person',
            name: this.displayName,
            alternateName: this.id,
            image: this.avatar,
            sameAs: Object.keys(this.platforms || {}).map(s => this.platforms[s].url),
          }),
          type: 'application/ld+json',
        },
      ],
      link: [
        { rel: 'canonical', href: `/${this.id}` },
      ],
    };
  },
  computed: {
    getLikerLandAppURL,
    maskedWallet() {
      return this.wallet.replace(/((?:cosmos1|0x).{4}).*(.{10})/, '$1...$2');
    },
    httpReferrer() {
      return this.$route.query.referrer || document.referrer || undefined;
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.lc-container-3-extend-bg {
  .ether & {
    background-image: linear-gradient(261deg, #a8a8a8, #6886a1);
  }
}

.address-container {
  & + & {
    margin-top: 18px;
  }
}

.address-title {
  margin-bottom: 8px;

  font-size: 14px;
}

.address-content {
  overflow: hidden;

  margin: 0 auto;

  white-space: nowrap;
  text-overflow: ellipsis;

  font-size: 19px;
  line-height: 1.2;
}

p {
  max-width: 432px;
  margin: auto;

  text-align: center;

  color: $like-gray-4;
}

.create-account-wrapper {
  .md-button {
    display: block;

    margin: 16px auto;
  }

  a {
    text-decoration: underline;

    color: $like-gray-4;
  }
}

#payment-confirm {
  display: block;

  margin: 0 auto;

  text-transform: none;

  &.likecoin {
    text-transform: none;

    color: $like-white;

    font-size: 24px;
  }

  &.lc-alert {
    padding: 4px 0;
  }

  &.eth {
    background-image: linear-gradient(261deg, #a8a8a8, #6886a1);

    .button-content-wrapper {
      display: flex;
      align-items: center;
      flex-direction: row;

      img {
        position: absolute;
        top: 8px;
        left: 16px;
      }
    }
  }
}
</style>
