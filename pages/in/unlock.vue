<template>
  <div class="lc-container-1 unlock-page">

    <div class="lc-container-2 unlock-page__hero lc-margin-top-16">
      <div class="lc-container-3">
        <div class="lc-container-4">
          <div style="color: #50e3c2">
            <!-- eslint-disable vue/max-attributes-per-line max-len -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 152" style="max-width: 540px">
              <g style="fill: none;stroke: currentColor;stroke-linecap: round;stroke-linejoin: round;stroke-width: 9px">
                <polyline points="247.27 86.87 335.98 86.87 335.98 107.08" />
                <path d="M224.64,115.74h0A22.64,22.64,0,0,1,202,93.11V80.64a22.64,22.64,0,1,1,45.27,0V93.11A22.63,22.63,0,0,1,224.64,115.74Z" />
                <path d="M313.08,86.87v20.2" />
              </g>
              <g>
                <circle cx="178.5" cy="24.5" r="4.95" style="fill: currentColor" />
                <circle cx="431.5" cy="99.5" r="4.95" style="fill: currentColor" />
                <circle cx="401" cy="64" r="2.83" style="fill: currentColor" />
                <circle cx="141" cy="104" r="2.83" style="fill: currentColor" />
                <circle cx="55" cy="85" r="2.83" style="fill: currentColor" />
                <circle cx="509" cy="82" r="2.83" style="fill: currentColor" />
                <circle cx="372" cy="130" r="2.83" style="fill: currentColor" />
              </g>
            </svg>
            <!-- eslint-enable vue/max-attributes-per-line max-len -->
            <h1 class="unlock-page__hero-title">{{ $t('UnlockLikeCoinPage.title') }}</h1>
          </div>
          <p class="unlock-page__hero-description">{{ $t('UnlockLikeCoinPage.description') }}</p>
        </div>
      </div>
    </div>

    <div class="lc-container-2">
      <div class="unlock-page__cards">

        <div class="unlock-page__card unlock-page__card--likecoin">
          <div class="unlock-page__card-header">
            <div class="unlock-page__card-header-icon">
              <!-- eslint-disable vue/max-attributes-per-line max-len -->
              <svg xmlns="http://www.w3.org/2000/svg" width="52px" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="24.5" style="fill: #50e3c2;stroke: #fff;stroke-width: 3px" />
                <path d="M32,23a6,6,0,1,0-8.65,5.38v7h5.3v-7A6,6,0,0,0,32,23Z" style="fill: #fff;fill-rule: evenodd" />
              </svg>
              <!-- eslint-enable vue/max-attributes-per-line max-len -->
            </div>
            <div
              class="unlock-page__card-header-title"
              style="color: #28646E"
            >
              {{ $t('UnlockLikeCoinPage.card.likecoin.title') }}
            </div>
          </div>
          <div class="unlock-page__card-slogan">
            {{ $t('UnlockLikeCoinPage.card.likecoin.slogan') }}
          </div>
          <div class="unlock-page__card-body">
            <ul>
              <li>{{ $t('UnlockLikeCoinPage.card.likecoin.points[0]') }}</li>
              <li>{{ $t('UnlockLikeCoinPage.card.likecoin.points[1]') }}</li>
              <li>{{ $t('UnlockLikeCoinPage.card.likecoin.points[2]') }}</li>
              <li>{{ $t('UnlockLikeCoinPage.card.likecoin.points[3]') }}</li>
            </ul>
          </div>

          <div class="unlock-page__card-actions">
            <md-button
              class="md-raised"
              disabled
            >{{ $t('UnlockLikeCoinPage.card.likecoin.action.button') }}</md-button>
          </div>
        </div>

        <div class="unlock-page__card unlock-page__card--metamask">
          <div class="unlock-page__card-header">
            <div class="unlock-page__card-header-icon">
              <img src="~/assets/icons/metamask.svg">
            </div>
            <div
              class="unlock-page__card-header-title"
              style="font-size: 28px"
            >
              MetaMask
            </div>
          </div>
          <div class="unlock-page__card-body">
            <p class="wallet-notice-dialog__content__description">
              {{ $t('WalletNoticeDialog.page[1].description[0]') }}
            </p>
            <p class="wallet-notice-dialog__content__description md-layout lc-margin-top-16">
              <img
                src="~/assets/wallet-notice/protect.svg"
                style="width: 56px; margin-right: 8px; align-self: start"
              >
              <span
                style="color: #6E2828"
                class="md-layout-item"
              >
                {{ $t('WalletNoticeDialog.page[1].description[1]') }}
              </span>
            </p>
          </div>

          <div class="unlock-page__card-actions">
            <md-button
              class="md-raised"
              @click="onClickUnlock"
            >{{ $t('UnlockLikeCoinPage.card.metamask.action.button') }}</md-button>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>


<script>
import { mapActions } from 'vuex';
import UserUtil from '@/util/User';

import {
  checkIsMobileClient,
  checkIsTrustClient,
} from '~/util/client';

import EthMixin from '~/components/EthMixin';

export default {
  layout: 'defaultWithGrayHeader',
  mixins: [EthMixin],
  asyncData({ store, redirect }) {
    const user = store.getters.getUserInfo;
    if (user.wallet || user.cosmosWallet || store.getters.getUserLikeCoinAmountIsZero) {
      redirect('/in');
    }
  },
  head() {
    return {
      title: this.$t('UnlockLikeCoinPage.title'),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('UnlockLikeCoinPage.title'),
        },
      ],
    };
  },
  methods: {
    ...mapActions([
      'setWalletNoticeDialog',
      'linkWalletToUser',
      'setPopupError',
      'openPopupDialog',
      'doUserAuth',
    ]),
    async bindWallet() {
      const { action, ...query } = this.$route.query;
      this.$router.push({ query });
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
    onClickUnlock() {
      if (checkIsMobileClient() && !checkIsTrustClient(this)) {
        this.openPopupDialog({
          allowClose: true,
          header: this.$t('LikeButtonIntro.setupWallet'),
          message: this.$t('Error.REQUIRED_DESKTOP_CHROME'),
          confirmText: this.$t('General.button.confirm'),
        });
      } else {
        // this.$router.push({ query: { ...this.$route.query, action: 'sign' } });
        this.setWalletNoticeDialog({
          isShow: true,
          onConfirm: () => this.startWeb3AndCb(this.bindWallet),
        });
      }
    },
  },
};
</script>


<style lang="scss">
@import "~assets/variables";
@import "~assets/default";

.unlock-page {
  padding-bottom: 60px;

  background: $like-gray-1;

  &__hero {
    padding: 16px 24px 90px;

    text-align: center;

    color: white;
    background-color: $like-green;

    &-title {
      margin-bottom: 20px;

      color: inherit;

      font-size: 24px;
      font-weight: 600;
    }

    &-description {
      font-size: 16px;
    }
  }

  &__cards {
    display: flex;

    flex-wrap: wrap;
    justify-content: center;

    margin: -54px 8px 0;
  }

  &__card {
    display: flex;
    overflow: hidden;

    flex-direction: column;

    width: 100%;
    max-width: 392px;
    margin: 8px;

    border-radius: 6px;
    background: white;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.25);

    &-header {
      display: flex;
      align-items: center;
      justify-content: center;

      padding: 36px 40px;

      font-size: 24px;
      font-weight: 600;
      line-height: 1.25;

      @media screen and (max-width: 600px) {
        padding: 20px
      }

      &-icon {
        flex-shrink: 0;

        width: 52px;
        height: 52px;

        margin-right: 12px;
      }
    }

    &-slogan {
      margin-top: 4px;
      padding: 8px 40px;

      text-align: center;

      color: $civic-green;
      background: $like-green;

      font-size: 32px;
      font-weight: 400;
      line-height: 1.25;

      @media screen and (max-width: 600px) {
        font-size: 24px;
      }
    }

    &-body {
      flex-grow: 1;

      padding: 24px 40px 16px;

      color: $like-gray-5;

      font-size: 16px;

      ul {
        margin: 8px 0;

        list-style: none;

        li {
          &::before  {
            margin-right: 8px;

            content: '●';

            color: $civic-green;
          }

          &:not(:first-child) {
            margin-top: 8px;
          }
        }
      }
    }

    &-actions {
      padding: 0 16px 16px;

      text-align: center;

      .md-button {
        overflow: hidden;

        min-width: 200px;

        border-radius: 99px;

        font-size: 16px;

        &:not([disabled]) {
          border: 2px solid $civic-green;

          &.md-raised {
            box-shadow: 2px 2px 2px 0 rgba(black, 0.10);
          }

          &:hover::before {
            background-color: transparentize($civic-green, 0.5)
          }

          .md-button-content {
            color: $like-green;
          }
        }
      }
    }

    &--likecoin {
      .unlock-page__card {
        &-header {
          color: $like-green;
          background-image: $like-linear-gradient;
        }
      }
    }

    &--metamask {
      .unlock-page__card {
        &-header {
          color: black;
          background-image: linear-gradient(197deg, #ED8526 0%, #EEBE78 100%);
        }
      }
    }
  }
}
</style>
