<!-- eslint-disable max-len -->
<template>
  <div
    v-if="isLoading || isSigning"
    key="loading"
    class="likepay-body likepay-body--center"
  >
    <span v-if="isSigning" class="likepay-text-panel">
      {{ $t('General.signing') }}
    </span>
    <span v-else class="likepay-text-panel">
      {{ $t('General.loading') }}
    </span>
  </div>
  <div
    v-else
    key="panel"
    class="likepay-body"
  >
    <div class="likepay-panel">
      <section class="likepay-panel__section-container">
        <header class="likepay-panel__section-header">
          <div class="likepay-panel__header-title">{{ $t('PaymentWidget.title') }}</div>
          <svg
            class="likepay-panel__header-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 68 52"
          >
            <circle
              cx="25.29"
              cy="46.64"
              r="1.13"
            />
            <circle
              cx="25.29"
              cy="5.94"
              r="1.13"
            />
            <circle
              cx="30.56"
              cy="45.95"
              r="1.13"
            />
            <circle
              cx="20.02"
              cy="6.63"
              r="1.13"
            />
            <circle
              cx="35.47"
              cy="43.92"
              r="1.13"
            />
            <circle
              cx="15.12"
              cy="8.67"
              r="1.13"
            />
            <circle
              cx="39.68"
              cy="40.68"
              r="1.13"
            />
            <circle
              cx="10.9"
              cy="11.9"
              r="1.13"
            />
            <circle
              cx="42.92"
              cy="36.47"
              r="1.13"
            />
            <circle
              cx="7.67"
              cy="16.12"
              r="1.13"
            />
            <circle
              cx="44.95"
              cy="31.56"
              r="1.13"
            />
            <circle
              cx="5.63"
              cy="21.02"
              r="1.13"
            />
            <circle
              cx="4.94"
              cy="26.29"
              r="1.13"
            />
            <circle
              cx="44.95"
              cy="21.02"
              r="1.13"
            />
            <circle
              cx="5.63"
              cy="31.56"
              r="1.13"
            />
            <circle
              cx="42.92"
              cy="16.12"
              r="1.13"
            />
            <circle
              cx="7.67"
              cy="36.47"
              r="1.13"
            />
            <circle
              cx="39.68"
              cy="11.9"
              r="1.13"
            />
            <circle
              cx="10.9"
              cy="40.68"
              r="1.13"
            />
            <circle
              cx="35.47"
              cy="8.67"
              r="1.13"
            />
            <circle
              cx="15.12"
              cy="43.92"
              r="1.13"
            />
            <circle
              cx="30.56"
              cy="6.63"
              r="1.13"
            />
            <circle
              cx="20.02"
              cy="45.95"
              r="1.13"
            />
            <path
              d="M25.29,51.58A25.29,25.29,0,1,1,49.57,19.2a1,1,0,1,1-2,.59A23.19,23.19,0,1,0,25.29,49.48,23.33,23.33,0,0,0,47.56,32.79a1,1,0,0,1,2,.59A25.43,25.43,0,0,1,25.29,51.58Z"
              style="fill-rule: evenodd"
            />
            <path
              d="M23.76,22.61a.57.57,0,0,1-.45-.2.59.59,0,0,1,.06-.83,12.49,12.49,0,0,0,2.52-2.89A2.09,2.09,0,0,1,28,17.51a.59.59,0,0,1-.16,1.16c-.48-.06-.8.4-.92.6a13.49,13.49,0,0,1-2.77,3.2A.56.56,0,0,1,23.76,22.61Zm-9.91,10a.6.6,0,0,1-.45-.21.59.59,0,0,1,.08-.83,16.77,16.77,0,0,1,2.16-1.44.59.59,0,0,1,.53,1,14.51,14.51,0,0,0-1.94,1.3A.58.58,0,0,1,13.85,32.58ZM28.64,27c.24.22.51.13.76-.11a22.32,22.32,0,0,0,4.11-5.5.52.52,0,0,1,.66-.33c.33.14.33.7,0,1.31a20.66,20.66,0,0,1-4,5.64.46.46,0,0,0,0,.67c.19.17.5.16.79-.14a23.11,23.11,0,0,0,2.52-2.94.56.56,0,0,1,.57-.29c.28.05.33.32.24.65a16.83,16.83,0,0,1-2.22,3.14c-1.59,1.78-3.19,2.76-6.27,4.36a5.44,5.44,0,0,0-2.36,1.91c-.45.75-.58,1-.62,1.09a.74.74,0,0,0,.32,1,.72.72,0,0,0,.32.08.74.74,0,0,0,.67-.45,6.73,6.73,0,0,1,.55-1,4.23,4.23,0,0,1,1.81-1.6,17.83,17.83,0,0,0,6.13-4.29,20.81,20.81,0,0,0,2.24-3.08c.86-1.45.41-2.69-.36-2.9a.11.11,0,0,1-.07-.15,7.5,7.5,0,0,0,1-2.29,1.46,1.46,0,0,0-1.09-1.88.1.1,0,0,1-.07-.12c.07-.24.13-.54.17-.74a1.67,1.67,0,0,0-1.13-2,1.73,1.73,0,0,0-1.39.29.13.13,0,0,1-.18,0A1.06,1.06,0,0,0,31,17a1.72,1.72,0,0,0-1.74,1.17A12.45,12.45,0,0,1,27,21.4a25.45,25.45,0,0,1-4.37,3.7c-.2.13-.49.1-.45-.17.05-.43.51-3.33.59-4.19a1.73,1.73,0,0,0-1.45-2.13A2.1,2.1,0,0,0,19,20.28a34.11,34.11,0,0,0-1.63,4.87,14.73,14.73,0,0,0-.1,6,.62.62,0,0,1-.08.4,22.62,22.62,0,0,0-1.5,2.6.75.75,0,0,0,.31,1,.73.73,0,0,0,.35.09.72.72,0,0,0,.65-.42c.22-.47.68-1.35.86-1.71.31-.64.51-1.06.6-1.32a2,2,0,0,0,0-1.16,12.14,12.14,0,0,1,.12-4.84,51.71,51.71,0,0,1,1.73-5.41c.18-.43.43-.57.68-.54s.72.14.59,1c-.25,1.59-.59,3.6-.71,4.28a1.37,1.37,0,0,0,.5,1.46c.48.28,1,.12,1.59-.26a30.46,30.46,0,0,0,5-4.25,11.8,11.8,0,0,0,2.35-3.57.67.67,0,0,1,.78-.36c.16.05.35.26.21.71a15.51,15.51,0,0,1-4.3,6,.52.52,0,0,0-.11.75.49.49,0,0,0,.72,0,17.14,17.14,0,0,0,4.3-5.68,10.47,10.47,0,0,0,.52-1.32c.13-.37.41-.5.61-.46s.48.35.39.84a8.53,8.53,0,0,1-.64,1.78,25.06,25.06,0,0,1-4.07,5.59A.48.48,0,0,0,28.64,27ZM18,19c.09-.08,0-.18,0-.26-.13-.41-.85-2.1-1-2.44a.26.26,0,0,0-.35-.14,2.58,2.58,0,0,0-.7.5,2.78,2.78,0,0,0-.59.63.25.25,0,0,0,.1.36c.31.23,1.89,1.17,2.28,1.35.08,0,.17.08.26,0Zm-.62,1.11c0-.12-.13-.14-.21-.16a24.33,24.33,0,0,0-2.62-.38c-.2,0-.28.08-.3.22a2.56,2.56,0,0,0,.06.86,3,3,0,0,0,.23.83.25.25,0,0,0,.36.1c.36-.14,2-1,2.34-1.24.07-.05.16-.11.14-.23ZM31.05,34c-.12,0-.15.11-.18.19-.15.4-.6,2.18-.66,2.57a.25.25,0,0,0,.19.32,3,3,0,0,0,.86,0,2.6,2.6,0,0,0,.86-.15c.12-.05.19-.15.14-.34-.11-.38-.8-2.08-1-2.46,0-.07-.08-.17-.2-.16Zm1-.83c-.06.11,0,.19.07.26.26.33,1.55,1.64,1.85,1.89a.25.25,0,0,0,.37,0,2.37,2.37,0,0,0,.47-.72,3,3,0,0,0,.33-.81c0-.13,0-.24-.23-.3-.37-.1-2.19-.4-2.61-.42a.22.22,0,0,0-.25.09Z"
              style="fill-rule: evenodd"
            />
            <path
              d="M49.6,25.26H47.25a1,1,0,1,0,0,2.07H49.6a1,1,0,1,0,0-2.07Zm17.84,1.61,0-.05a1.39,1.39,0,0,0,.06-.13l0-.07,0-.12a.75.75,0,0,0,0-.21.65.65,0,0,0,0-.2l0-.13,0-.07a.67.67,0,0,0-.06-.12l0-.05a1,1,0,0,0-.13-.16l-4.79-4.79a1,1,0,0,0-1.46,0,1.05,1.05,0,0,0,0,1.47l3,3H53.81a1,1,0,1,0,0,2.07H64.08l-3,3a1,1,0,0,0,.73,1.76,1,1,0,0,0,.73-.3L67.31,27A.93.93,0,0,0,67.44,26.87Z"
              style="fill-rule: evenodd"
            />
          </svg>
        </header>
        <div class="likepay-panel__section-amount">
          <div class="likepay-panel__section-amount-text">{{ actualSendAmount }} LIKE</div>
        </div>
        <div class="likepay-panel__section-meta">
          <div class="likepay-panel__section-meta-label">{{ $t('PaymentWidget.label.to') }}</div>
          <a
            v-for="u in toUsers"
            :key="u.user"
            :href="`${LIKER_LAND_URL}/${u.user}`"
            target="_blank"
            rel="noopener"
            class="likepay-panel__user"
          >
            <lc-avatar
              v-if="u.avatar"
              :src="u.avatar"
              size="32"
            />
            <div class="likepay-panel__user-display-name">
              {{ u.displayName }}
            </div>
          </a>
        </div>
        <div
          v-if="agentId && hasAgentFee"
          class="likepay-panel__section-meta"
        >
          <div class="likepay-panel__section-meta-label">{{ $t('PaymentWidget.label.via') }}</div>
          <a
            class="likepay-panel__user"
            :href="`${LIKER_LAND_URL}/${agentUser.user}`"
            target="_blank"
            rel="noopener"
          >
            <lc-avatar
              v-if="agentUser.avatar"
              :src="agentUser.avatar"
              size="32"
            />
            <div class="likepay-panel__user-display-name">
              {{ agentUser.displayName }}
            </div>
          </a>
        </div>
      </section>
      <section
        class="likepay-panel__section-dropdown-container"
      >
        <button
          class="likepay-panel__dropdown-header"
          @click="toggleDetails"
        >
          <div class="likepay-panel__dropdown-header-text">
            {{ $t('PaymentWidget.label.details') }}
          </div>
          <svg
            ref="dropdownArrow"
            class="likepay-panel__dropdown-arrow"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              :d="`
              M12,15.5a1,1,0,0,1-.64-.23l-6-5
              A1,1,0,1,1,6.64,8.73
              L12,13.2l5.36-4.47a1,1,0,0,1,1.28,1.54l-6,5
              A1,1,0,0,1,12,15.5
              Z
              `"
            />
          </svg>
        </button>
        <div
          ref="dropdownBody"
          class="likepay-panel__dropdown-body"
          style="height: 0px"
        >
          <div>
            <div class="likepay-panel__section-meta-grid">
              <div
                v-if="agentId && !hasAgentFee"
                class="likepay-panel__section-meta-grid-item"
              >
                <div class="likepay-panel__section-meta-grid-item-label">
                  {{ $t('PaymentWidget.label.via') }}
                </div>
                <a
                  class="likepay-panel__section-meta-grid-item-value likepay-panel__user"
                  :href="`${LIKER_LAND_URL}/${agentUser.user}`"
                  target="_blank"
                  rel="noopener"
                >
                  <lc-avatar
                    v-if="agentUser.avatar"
                    :src="agentUser.avatar"
                    size="32"
                  />
                  <div class="likepay-panel__user-display-name">
                    {{ agentUser.displayName }}
                  </div>
                </a>
              </div>
              <div
                v-if="agentId"
                class="likepay-panel__section-meta-grid-item"
              >
                <div class="likepay-panel__section-meta-grid-item-label">
                  {{ $t('PaymentWidget.label.agentFee', { user: agentUser.displayName }) }}
                </div>
                <div class="likepay-panel__section-meta-grid-item-value">{{ agentFee }} LIKE</div>
              </div>
              <div
                v-if="gasFee"
                class="likepay-panel__section-meta-grid-item"
              >
                <div class="likepay-panel__section-meta-grid-item-label">
                  {{ $t('PaymentWidget.label.gasFee') }}
                </div>
                <div class="likepay-panel__section-meta-grid-item-value">{{ gasFee }} LIKE</div>
              </div>
              <div class="likepay-panel__section-meta-grid-item">
                <div class="likepay-panel__section-meta-grid-item-label">
                  {{ $t('PaymentWidget.label.receiveSum') }}
                </div>
                <div class="likepay-panel__section-meta-grid-item-value">
                  {{ sumOfToAmount }} LIKE
                </div>
              </div>
              <div
                v-if="remarks"
                class="likepay-panel__section-meta-grid-item"
              >
                <div class="likepay-panel__section-meta-grid-item-label">
                  {{ $t('PaymentWidget.label.remarks') }}
                </div>
                <div class="likepay-panel__section-meta-grid-item-value">{{ remarks }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <footer class="likepay-panel__footer">
      <div v-if="!getUserIsRegistered">
        <button
          class="likepay-block-button"
          @click="onClickSignInButton"
        >
          {{ $t('Home.Header.button.signIn') }}
        </button>
      </div>
      <div
        v-else-if="getAuthCoreNeedReAuth"
        class="create-account-wrapper"
      >
        <button
          class="likepay-block-button"
          @click="onClickAuthCoreReAuth"
        >
          {{ $t('AuthCore.button.reAuthNeeded') }}
        </button>
      </div>
      <div v-else>
        <button
          class="likepay-block-button"
          @click="submitTransfer"
        >
          {{ $t('General.button.confirm') }}
        </button>
      </div>
    </footer>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { IS_TESTNET, LIKER_LAND_URL } from '@/constant';
import {
  queryLikeCoinBalance as queryCosmosLikeCoinBalance,
  transfer as cosmosTransfer,
  transferMultiple as cosmosTransferMultiple,
  getTransferInfo as getCosmosTransferInfo,
} from '@/util/CosmosHelper';
import User from '@/util/User';
import {
  apiGetUserMinById,
} from '@/util/api/api';

const URL = require('url-parse');

export default {
  name: 'payment',
  layout: 'likepay',
  data() {
    return {
      LIKER_LAND_URL,
      toIds: [],
      toUsers: [],
      amounts: [],
      agentId: '',
      agentUser: null,
      agentFee: '',
      redirectUri: '',
      isLoading: true,
      isSigning: false,
      showDetails: false,
      blocking: false,
      state: '',
      gasFee: '',
    };
  },
  async asyncData({
    query,
    error,
    redirect,
  }) {
    const {
      to: toString,
      amount: amountString,
      via: agentId,
      fee: agentFee,
      redirect_uri: redirectUri,
      blocking,
      state,
    } = query;
    let {
      remarks = `LIKE pay${agentId ? ` via ${agentId}` : ''}`,
    } = query;
    if (!Object.keys(query).length) {
      return redirect('https://docs.like.co/developer/like-pay/web-widget/reference');
    }
    if (!toString) {
      return error({ statusCode: 400, message: 'INVALID_RECIPIENT' });
    }
    if (!amountString) {
      return error({ statusCode: 400, message: 'INVALID_AMOUNT' });
    }
    const toIds = toString.split(',');
    const amounts = amountString.split(',');
    if (toIds.length !== amounts.length) {
      return error({ statusCode: 400, message: 'RECIPIENT_AND_AMOUNT_SIZE_MISMATCH' });
    }
    if (!agentId && (agentFee)) {
      return error({ statusCode: 400, message: 'MISSING_VIA' });
    }

    if (remarks) {
      remarks = remarks.substring(0, 255);
    }

    let promises = [];
    promises.push(agentId ? apiGetUserMinById(agentId, { type: 'payment' }) : Promise.resolve(null));
    promises = promises.concat(toIds.map(id => apiGetUserMinById(id, { type: 'payment' })));

    return Promise.all(promises).then((res) => {
      const [agentRes, ...toRes] = res;
      let agentUser;
      if (agentRes) {
        agentUser = {
          ...agentRes.data,
          avatarHalo: User.getAvatarHaloType(agentRes.data),
        };
      }
      const toUsers = toRes.map((u) => {
        const {
          user,
          cosmosWallet,
          avatar,
          displayName,
          paymentRedirectWhiteList,
        } = u.data;
        return {
          user,
          cosmosWallet,
          avatar,
          displayName,
          avatarHalo: User.getAvatarHaloType(u.data),
          paymentRedirectWhiteList,
        };
      });
      if (agentUser && !agentUser.cosmosWallet) {
        error({ statusCode: 400, message: 'VIA_USER_HAS_NO_WALLET' });
      }

      if (toUsers.some(u => !u.cosmosWallet)) {
        error({ statusCode: 400, message: 'RECEIPIENT_HAS_NO_WALLET' });
      }

      if (redirectUri) {
        if (agentId) {
          const {
            paymentRedirectWhiteList: agentWhiteList = [],
          } = agentUser;
          if (!IS_TESTNET && (!agentWhiteList || !agentWhiteList.length)) {
            error({ statusCode: 400, message: 'AGENT_NOT_SETUP_PAYMENT_REDIRECT' });
          }
          if (agentWhiteList.length && !agentWhiteList.includes(redirectUri)) {
            error({ statusCode: 400, message: 'REDIRECT_URI_NOT_WHITELIST' });
          }
        } else {
          if (toUsers.length > 1) {
            error({ statusCode: 400, message: 'CANNOT_REDIRECT_MULTIPLE_RECEIPIENTS' });
          }
          const {
            paymentRedirectWhiteList: userWhiteList = [],
          } = toUsers[0];
          if (!IS_TESTNET && (!userWhiteList || !userWhiteList.length)) {
            error({ statusCode: 400, message: 'USER_NOT_SETUP_PAYMENT_REDIRECT' });
          }
          if (userWhiteList.length && !userWhiteList.includes(redirectUri)) {
            error({ statusCode: 400, message: 'REDIRECT_URI_NOT_WHITELIST' });
          }
        }
      }

      return {
        toIds,
        amounts,
        toUsers,
        agentId,
        agentUser,
        agentFee,
        redirectUri,
        remarks,
        blocking,
        state,
      };
    }).catch((e) => {
      console.error(e);
      error({ statusCode: 404, message: 'RECEIPIENT_NOT_FOUND' });
    });
  },
  head() {
    return {
      title: 'LIKE pay',
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
      'getLikeCoinUsdNumericPrice',
      'getUserInfo',
      'getAuthCoreNeedReAuth',
      'getIsShowingTxPopup',
      'getPendingTxInfo',
    ]),
    httpReferrer() {
      return this.$route.query.referrer || document.referrer || undefined;
    },
    sumOfToAmount() {
      if (!this.amounts) return '0';
      const amount = this.amounts.reduce(
        (acc, a) => acc.plus(a),
        new BigNumber(0),
      );
      return amount.toFixed();
    },
    actualSendAmount() {
      let amount = new BigNumber(this.sumOfToAmount);
      if (this.agentUser && this.agentFee) {
        amount = amount.plus(this.agentFee);
      }
      return amount.toFixed();
    },
    totalAmount() {
      let amount = new BigNumber(this.actualSendAmount);
      if (this.gasFee) amount = amount.plus(this.gasFee);
      return amount.toFixed();
    },
    isMultiSend() {
      return this.toIds.length > 1 || this.hasAgentFee;
    },
    hasAgentFee() {
      return this.agentUser && this.agentFee && this.agentFee !== '0';
    },
    usdTransferStrValue() {
      if (this.getLikeCoinUsdNumericPrice && this.totalAmount) {
        const value = new BigNumber(this.totalAmount);
        const usdValue = value.times(this.getLikeCoinUsdNumericPrice);
        let decimalPlace = 2;
        if (usdValue.lt(0.01)) decimalPlace = 4;
        return value.times(this.getLikeCoinUsdNumericPrice).toFixed(decimalPlace);
      }
      return null;
    },
    likePayMetadata() {
      const {
        toIds,
        amounts,
        agentId,
        agentFee,
        redirectUri,
        remarks,
        blocking,
        state,
      } = this;
      return {
        likePay: {
          toIds,
          amounts,
          agentId,
          agentFee,
          redirectUri,
          remarks,
          blocking,
          state,
        },
      };
    },
  },
  async mounted() {
    this.calculateGasFee();
    if (!this.getLikeCoinUsdNumericPrice) {
      await this.queryLikeCoinUsdPrice();
    }
    this.isLoading = false;
  },
  methods: {
    ...mapActions([
      'popupAuthDialogInPlace',
      'setReAuthDialogShow',
      'doUserAuth',
      'sendCosmosPayment',
      'setErrorMsg',
      'closeTxDialog',
      'queryLikeCoinUsdPrice',
      'fetchCurrentCosmosWallet',
      'prepareCosmosTxSigner',
    ]),
    toggleDetails() {
      const isCollapsing = !this.showDetails;
      const tl = new this.$gsap.TimelineMax({
        onComplete: () => {
          this.showDetails = !this.showDetails;
        },
      });
      tl.to(this.$refs.dropdownBody, 0.5, {
        height: isCollapsing ? 0 : this.$refs.dropdownBody.scrollHeight,
        ease: 'easeOutPower4',
        clearProps: isCollapsing ? '' : 'height',
      }, 0);
      tl.to(this.$refs.dropdownArrow, 0.2, {
        rotationZ: isCollapsing ? 0 : 180,
        ease: 'easeOutPower4',
      }, 0);
    },
    maskedWallet(wallet) {
      return wallet.replace(/((?:cosmos1|0x).{4}).*(.{10})/, '$1...$2');
    },
    async calculateGasFee() {
      let gas;
      let gasPrices;
      const from = await this.fetchCurrentCosmosWallet();
      if (!from) return '';
      const to = this.toUsers[0].cosmosWallet;
      if (this.isMultiSend) {
        const tos = this.toUsers.map(u => u.cosmosWallet);
        const values = [...this.amounts];
        if (this.hasAgentFee) {
          tos.push(this.agentUser.cosmosWallet);
          values.push(this.agentFee);
        }
        ({ gas, gasPrices } = await cosmosTransferMultiple(
          {
            from,
            tos,
            values,
            memo: this.remarks,
          },
          null,
          { simulate: true },
        ));
      } else {
        ({ gas, gasPrices } = await cosmosTransfer(
          {
            from,
            to,
            value: this.actualSendAmount,
            memo: this.remarks,
          },
          null,
          { simulate: true },
        ));
      }
      this.gasFee = new BigNumber(gas).multipliedBy(gasPrices[0].amount).dividedBy(1e9).toFixed();
      return this.gasFee;
    },
    async submitTransfer() {
      this.isLoading = true;
      this.isSigning = true;
      try {
        const { cosmosWallet } = this.getUserInfo;
        const amount = new BigNumber(this.totalAmount);
        const from = await this.fetchCurrentCosmosWallet();
        if (!from) {
          throw new Error('VALIDATION_FAIL');
        }
        const userWallet = cosmosWallet;
        if (from !== userWallet) {
          this.setErrorMsg(this.$t('Transaction.error.authcoreWalletNotMatch'));
          throw new Error('VALIDATION_FAIL');
        }
        const to = this.toUsers[0].cosmosWallet;
        if (from === to) {
          this.setErrorMsg(this.$t('Transaction.error.sameUser'));
          throw new Error('VALIDATION_FAIL');
        }
        const balance = await queryCosmosLikeCoinBalance(from);
        if (amount.gt(balance)) {
          this.setErrorMsg(
            this.$t('Transaction.error.likecoinInsufficient'),
          );
          throw new Error('VALIDATION_FAIL');
        }
        const signer = await this.prepareCosmosTxSigner();
        let txHash;
        const showDialogAction = !this.redirectUri;
        const isWait = !!this.blocking;
        const metadata = this.likePayMetadata;
        if (this.isMultiSend) {
          const tos = this.toUsers.map(u => u.cosmosWallet);
          const values = [...this.amounts];
          if (this.hasAgentFee) {
            tos.push(this.agentUser.cosmosWallet);
            values.push(this.agentFee);
          }
          txHash = await this.sendCosmosPayment({
            signer,
            from,
            tos,
            values,
            memo: this.remarks,
            showDialogAction,
            isWait,
            metadata,
          });
        } else {
          txHash = await this.sendCosmosPayment({
            signer,
            from,
            to,
            value: this.actualSendAmount,
            memo: this.remarks,
            showDialogAction,
            isWait,
            metadata,
          });
        }
        this.isSigning = false;
        this.postTransaction({ txHash });
      } catch (error) {
        if (error.message !== 'VALIDATION_FAIL') console.error(error);
      } finally {
        this.isLoading = false;
        this.isSigning = false;
      }
    },
    async postTransaction({ txHash, error } = {}) {
      if (this.redirectUri) {
        let success;
        if (this.blocking) {
          const { isFailed } = await getCosmosTransferInfo(txHash, { blocking: true });
          success = !isFailed;
        }
        const { state, remarks } = this;
        const url = new URL(this.redirectUri, true);
        if (txHash) url.query.tx_hash = txHash;
        if (error) url.query.error = error;
        if (state) url.query.state = state;
        if (remarks) url.query.remarks = remarks;
        if (success !== undefined) url.query.success = success;
        url.set('query', url.query);
        window.location.href = url.toString();
      } else if (this.getIsShowingTxPopup) {
        this.closeTxDialog();
        this.$router.push({
          name: 'in-tx-id',
          params: { id: txHash, tx: this.getPendingTxInfo },
        });
      }
    },
    onClickSignInButton() {
      this.popupAuthDialogInPlace({ route: this.$route, isSignIn: true });
    },
    onClickAuthCoreReAuth() {
      this.setReAuthDialogShow(true);
    },
  },
};
</script>
