<!-- eslint-disable max-len -->
<template>
  <div
    v-if="isLoading"
    key="loading"
    class="likepay-body likepay-body--center iscn-body"
  >
    <span class="likepay-text-panel">{{ $t('General.loading') }}</span>
  </div>
  <div
    v-else
    key="panel"
    class="likepay-body iscn-body"
  >
    <header class="iscn-body__header">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 30 30"
        width="30"
      >
        <path
          :d="`
            M20.16,9.55,15.58,5
            C11.22.61,2.42-1.06.68.68
            S.61,11.22,5,15.58
            l4.58,4.58
            a12.29,12.29,0,0,0,2.69,9.44,1.09,1.09,0,0,0,1.6.09
            l2.62-2.62,1.83-1.83,1.55.91,6.3-6.3-.91-1.55,1.83-1.83,2.62-2.62
            a1.08,1.08,0,0,0-.1-1.6,12.3,12.3,0,0,0-9.43-2.7
          `"
          fill="currentColor"
          fill-rule="evenodd"
        />
      </svg>
      <h1>{{ $t('ISCNWidget.title') }}</h1>
    </header>

    <div class="likepay-panel">
      <section class="likepay-panel__section-container">

        <div class="likepay-panel__section-meta">
          <div class="likepay-panel__section-meta-label">
            {{ $t('ISCNWidget.label.title') }}
          </div>
          <div class="likepay-panel__section-meta-value">{{ title }}</div>
        </div>

        <div
          v-if="getUserInfo && getUserInfo.user"
          class="likepay-panel__section-meta"
        >
          <div class="likepay-panel__section-meta-label">
            {{ $t('ISCNWidget.label.creator') }}
          </div>
          <a
            :href="`${LIKER_LAND_URL}/${getUserInfo.user}`"
            target="_blank"
            rel="noopener"
            class="likepay-panel__user"
          >
            <lc-avatar
              v-if="getUserInfo.avatar"
              :src="getUserInfo.avatar"
              :halo="avatarHalo"
              size="32"
            />
            <div class="likepay-panel__user-display-name">
              {{ getUserInfo.displayName }}
            </div>
          </a>
        </div>

        <div class="likepay-panel__section-meta">
          <div class="likepay-panel__section-meta-label">
            {{ $t('ISCNWidget.label.type') }}
          </div>
          <div class="likepay-panel__section-meta-value">{{ type }}</div>
        </div>

        <div
          v-if="licenseObj"
          class="likepay-panel__section-meta"
        >
          <div class="likepay-panel__section-meta-label">
            {{ $t('ISCNWidget.label.license') }}
          </div>
          <div class="likepay-panel__section-meta-value">
            <a
              :href="licenseObj.url"
              target="_blank"
              rel="noopener"
            >{{ licenseObj.displayName }}</a>
          </div>
        </div>

        <div
          v-if="tags && tags.length"
          class="likepay-panel__section-meta"
        >
          <div class="likepay-panel__section-meta-label">
            {{ $t('ISCNWidget.label.tags') }}
          </div>
          <div class="likepay-panel__section-meta-value">
            {{ tags.join(', ') }}
          </div>
        </div>
      </section>

      <section class="likepay-panel__section-dropdown-container">
        <div class="likepay-panel__dropdown-body">
          <div>
            <div class="likepay-panel__section-meta-grid">
              <div class="likepay-panel__section-meta-grid-item">
                <div class="likepay-panel__section-meta-grid-item-label">
                  {{ $t('ISCNWidget.label.fingerprint') }}
                </div>
                <div class="likepay-panel__section-meta-grid-item-value likepay-panel__section-meta-grid-item-value--fingerprint">
                  <a
                    :href="ipfsURL"
                    target="_blank"
                    rel="noopener"
                  >{{ fingerprint }}</a>
                </div>
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
import { ISCN_LICENSES, ISCN_PUBLISHERS } from '@/util/cosmos/iscnConstant';
import { getISCNTransferInfo } from '@/util/cosmos/iscn';
import { LIKER_LAND_URL } from '@/constant';

import User from '@/util/User';

const URL = require('url-parse');

export default {
  name: 'payment',
  layout: 'likepay',
  data() {
    return {
      isLoading: false,
      fingerprint: '',
      title: '',
      type: 'article',
      tags: [],
      license: '',
      publisher: '',
      redirectUri: '',
      state: '',
      memo: '',
    };
  },
  async asyncData({
    query,
    error,
    redirect,
  }) {
    const {
      fingerprint,
      type = 'article',
      tags: tagsString = '',
      publisher,
      redirect_uri: redirectUri,
      opener,
      state,
    } = query;
    let {
      license,
      title,
    } = query;
    const tags = tagsString ? tagsString.split(',') : [];
    if (!Object.keys(query).length) {
      return redirect('https://docs.like.co/developer/iscn/web-widget/reference');
    }
    if (!fingerprint) {
      return error({ statusCode: 400, message: 'INVALID_FINGERPRINT' });
    }
    if (publisher) {
      if (!ISCN_PUBLISHERS[publisher]) {
        return error({ statusCode: 400, message: 'INVALID_PUBLISHER' });
      }
      ({ license } = ISCN_PUBLISHERS[publisher]);
    }
    if (license) {
      if (!ISCN_LICENSES[license]) {
        return error({ statusCode: 400, message: 'INVALID_LICENSE' });
      }
    } else {
      license = ISCN_PUBLISHERS.default;
    }
    if (title) {
      title = title.substring(0, 255);
    }

    return {
      fingerprint,
      title,
      type,
      tags,
      license,
      publisher,
      redirectUri,
      opener: opener && opener !== '0',
      state,
    };
  },
  head() {
    return {
      title: 'ISCN',
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
      'getUserId',
      'getUserInfo',
      'getAuthCoreNeedReAuth',
      'getIsShowingTxPopup',
      'getPendingTxInfo',
    ]),
    LIKER_LAND_URL() {
      return LIKER_LAND_URL;
    },
    avatarHalo() {
      return User.getAvatarHaloType(this.getUserInfo);
    },
    httpReferrer() {
      return this.$route.query.referrer || document.referrer || undefined;
    },
    redirectOrigin() {
      const url = new URL(this.redirectUri, true);
      return url.origin;
    },
    windowOpener() {
      if (!window) return null;
      return window.opener;
    },
    ipfsURL() {
      return `https://ipfs.io/ipfs/${this.fingerprint}`;
    },
    licenseObj() {
      const { license } = this;
      return {
        displayName: this.$t(`${this.license}`),
        url: `https://ipfs.io/ipfs/${ISCN_LICENSES[license]['/']}`,
      };
    },
  },
  async mounted() {
    if (this.opener && !window.opener) {
      this.$nuxt.error({ statusCode: 400, message: 'Cannot access window opener' });
    }
    this.isLoading = false;
  },
  methods: {
    ...mapActions([
      'popupAuthDialogInPlace',
      'setReAuthDialogShow',
      'doUserAuth',
      'sendISCNSignature',
      'setErrorMsg',
      'closeTxDialog',
      'prepareCosmosTxSigner',
    ]),
    async submitTransfer() {
      this.isLoading = true;
      try {
        const { cosmosWallet } = this.getUserInfo;
        const showDialogAction = !this.redirectUri;
        const isWait = !!this.blocking;

        const {
          fingerprint,
          title,
          tags,
          type,
          license,
          publisher,
        } = this;
        const txHash = await this.sendISCNSignature({
          userId: this.getUserId,
          displayName: this.getUserInfo.displayName,
          cosmosWallet,
          fingerprint,
          title,
          tags,
          type,
          license,
          publisher,
          showDialogAction,
          isWait,
        });
        this.postTransaction({ txHash });
      } catch (error) {
        if (error.message !== 'VALIDATION_FAIL') console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async postTransaction({ txHash, error } = {}) {
      if (this.opener || this.redirectUri) {
        let success;
        if (this.blocking) {
          const { isFailed } = await getISCNTransferInfo(txHash, { blocking: true });
          success = !isFailed;
        }
        const { state } = this;
        const payload = {};
        if (txHash) payload.tx_hash = txHash;
        if (error) payload.error = error;
        if (state) payload.state = state;
        if (success !== undefined) payload.success = success;
        if (this.opener) {
          const message = JSON.stringify({
            action: 'ISCN_SUBMITTED',
            data: payload,
          });
          this.windowOpener.postMessage(message, this.redirectOrigin);
          window.close();
        }
        // if (this.redirectUri) {
        //   const url = new URL(this.redirectUri, true);
        //   url.set('query', { ...url.query, ...payload });
        //   window.location.href = url.toString();
        // }
      } else if (this.getIsShowingTxPopup) {
        this.closeTxDialog();
        // TODO: swap to iscn page
        this.$router.push({
          name: 'in-tx-iscn-dev-id',
          params: { id: txHash, tx: this.getPendingTxInfo },
        });
      }
    },
    onClickSignInButton() {
      this.popupAuthDialogInPlace({ route: this.$route, isSignIn: true });
    },
  },
};
</script>

<style lang="scss">
@import '~assets/variables';

.iscn-body {
  &__header {
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 12px 8px;

    &,
    & h1 {
      text-align: center;

      color: $civic-green;

      font-size: 18px;
      font-weight: 600;
    }

    & h1 {
      margin: 0;
      margin-left: 8px;

      line-height: 1.5;
    }
  }
}
</style>
