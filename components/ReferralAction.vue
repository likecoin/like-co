<template>
  <div>
    <div class="email-notice lc-font-size-20" v-if="!isEmailVerified">
      {{ $t('Edit.referral.verifyEmailFirst') }}
    </div>

    <form v-else id="referralForm" v-on:submit.prevent="onSendEmail">

      <section class="md-layout referral-details">
        <div class="md-layout-item referral-description lc-font-size-20">
          {{ $t('Edit.referral.description') }}
        </div>
        <div class="md-layout md-layout-item referral-stat-boxes">
          <div class="md-layout-item referral-stat-box">
            <span class="referral-stat-number lc-font-size-56">{{ pending }}</span>
            <hr />
            <span class="referral-stat-description lc-font-size-14">{{ $t('Edit.referral.pending') }}</span>
          </div>
          <div class="md-layout-item referral-stat-box">
            <span class="referral-stat-number lc-font-size-56 verified">{{ verified }}</span>
            <hr />
            <span class="referral-stat-description lc-font-size-14 verified">
              <img :src="TickIcon" />
              {{ $t('Edit.referral.verified') }}
            </span>
          </div>
        </div>
      </section>

      <section class="md-layout invite-by-email-wrapper lc-padding-vertical-24">
        <div class="md-layout-item">
          <div class="address-field">
            <div class="address-title">
              {{ $t('Edit.referral.emailInvite') }}
            </div>
          </div>
          <md-field>
            <label class="input-redeem-hint">
              {{ $t('Edit.referral.emailInvite') }}
            </label>
            <md-input
              v-model="email"
              :title="$t('Edit.referral.emailInvite')"
              type="email"
              required
              :disabled="isProfileEdit" />
          </md-field>
        </div>
        <div v-if="!isProfileEdit" id="form-btn" class="md-layout-item md-size-33 md-xsmall-size-66 lc-padding-top-16">
          <material-button
            id="confirm-btn"
            type="submit"
            form="referralForm"
            :disabled="isBlocked || !email">
            {{ $t('Edit.referral.send') }}
          </material-button>
        </div>
      </section>

      <section class="address-field">
        <div class="address-title lc-padding-bottom-12">
          {{ $t('Edit.referral.altInvite') }}
        </div>
        <div class="md-layout referral-btn-wrapper">
          <material-button
            class="md-layout-item referral-btn"
            @click="onCopy" >
            <div class="button-content-wrapper">
              <md-icon v-if="copied" class="referral-btn-icon">check</md-icon>
              <img v-else class="referral-btn-icon" :src="LinkIcon" />
              {{ $t('Edit.referral.copyUrl') }}
            </div>
          </material-button>
          <material-button
            class="md-layout-item referral-btn"
            @click="onShareFB" >
            <div class="button-content-wrapper">
              <img class="referral-btn-icon" :src="FBIcon" />
              {{ $t('Edit.referral.facebook') }}
            </div>
          </material-button>
          <material-button
            class="md-layout-item referral-btn"
            @click="onShareTwitter" >
            <div class="button-content-wrapper">
              <img class="referral-btn-icon" :src="TwIcon" />
              {{ $t('Edit.referral.twitter') }}
            </div>
          </material-button>
        </div>
      </section>

    </form>
    <input class="hidden-input" ref="shareUrl" v-model="shareUrl"/>
  </div>
</template>

<script>
import FBIcon from '@/assets/icons/f-icon.svg';
import LinkIcon from '@/assets/icons/link-icon.svg';
import TickIcon from '@/assets/tokensale/tick.svg';
import TwIcon from '@/assets/icons/t-icon.svg';

import MaterialButton from '~/components/MaterialButton';

import { logTrackerEvent } from '@/util/EventLogger';
import { mapActions } from 'vuex';

export default {
  name: 'referral-action',
  props: {
    isProfileEdit: Boolean,
    isBlocked: Boolean,
    isEmailVerified: Boolean,
    pending: Number,
    verified: Number,
    user: String,
  },
  components: {
    MaterialButton,
  },
  data() {
    return {
      FBIcon,
      LinkIcon,
      TickIcon,
      TwIcon,

      email: '',
      copied: false,
    };
  },
  computed: {
    shareUrl() {
      return `https://like.co/register?from=${this.user}`;
    },
    twitterUrl() {
      return `https://twitter.com/intent/tweet?hashtags=likecoin&url=${encodeURI(this.shareUrl)}&text=${encodeURI(this.$t('Edit.referral.tweetContent'))}`;
    },
  },
  methods: {
    ...mapActions([
      'sendInvitationEmail',
      'setInfoMsg',
    ]),
    async onSendEmail() {
      await this.sendInvitationEmail({ email: this.email, user: this.user });
      this.setInfoMsg(this.$t('Edit.referral.sent', { email: this.email }));
      logTrackerEvent(this, 'Referral', 'ClickGetFreeLikeCoin', 'email invite', 1);
      this.email = '';
    },
    onCopy() {
      const copyText = this.$refs.shareUrl;
      copyText.select();
      this.copied = document.execCommand('copy');
      logTrackerEvent(this, 'Referral', 'sendInvitation', 'copy invite link', 1);
    },
    onShareFB() {
      if (window.FB && window.FB.ui) {
        window.FB.ui({
          method: 'share_open_graph',
          action_type: 'og.shares',
          action_properties: JSON.stringify({
            object: {
              'og:url': this.shareUrl,
              'og:title': this.$t('Edit.referral.ogTitle'),
              'og:description': this.$t('Edit.referral.ogDescription', { name: this.user }),
              'og:image': 'https://like.co/logo.png',
            },
          }),
        }, res => console.log(res));
        logTrackerEvent(this, 'Referral', 'sendInvitation', 'fb share invite', 1);
      }
    },
    onShareTwitter() {
      window.open(this.twitterUrl, 'twitter', 'height=285,width=550,resizable=1,noopener');
      logTrackerEvent(this, 'Referral', 'sendInvitation', 'twitter invite', 1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";
@import "~assets/default";

.hidden-input {
  position: absolute;

  overflow: hidden;
  clip: rect(0 0 0 0);

  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;

  border: 0;
}

.email-notice,
.referral-description {
  color: $like-gray-4;
}

#referralForm {
  .address-title {
    color: $like-dark-brown-1;
  }
  .referral-details {
    @media (max-width: 768px) {
      flex-direction: column;
    }

    .referral-description {
      line-height: 1.5;
    }

    .referral-stat-boxes {
      @media (max-width: 768px) {
        margin-top: 16px;
      }
    }

    .referral-stat-box {
      display: flex;
      flex-direction: column;
      justify-content: center;

      text-align: center;

      @media (min-width: 769px) {
        margin-left: 24px;
      }

      .verified {
        color: $like-green-2;
      }

      .referral-stat-number {
        font-weight: 300;
        line-height: 56px;
      }

      hr {
        height: 1px;
        margin: 12px;

        border: 0;
        background-color: $like-gray-3;
      }

      .referral-stat-description {
        min-height: 40px;
      }
    }
  }

  .invite-by-email-wrapper {
    .input-redeem-hint {
      font-size: 20px;
    }

    .md-focused .input-redeem-hint,
    .md-has-value .input-redeem-hint {
      opacity: 0;
    }

    @media (max-width: 600px) {
      display: flex;
      flex-direction: column;
    }
  }

  #form-btn {
    display: flex;
    align-items: center;

    margin: 0 auto;

    @media (min-width: 601px) {
      margin-left: 16px;
    }

    #confirm-btn {
      width: 100%;
      height: 40px;
    }
  }

  .referral-btn-wrapper {
    @media (max-width: 600px) {
      flex-direction: column;
    }

    .referral-btn {
      flex: 1;

      height: 40px;

      color: $like-green;
      background-color: $like-white;

      &:first-child {
        margin-left: 0;
      }

      @media (max-width: 768px) {
        font-size: 18px;
      }
      @media (max-width: 600px) {
        margin: 2px 0;
      }

      .button-content-wrapper {
        display: flex;
        align-items: center;
        flex-direction: row;

        .referral-btn-icon {
          position: absolute;
          top: 8px;
          left: 16px;

          padding-bottom: 5px;

          color: $like-green;
        }
      }

    }
  }
}
</style>
