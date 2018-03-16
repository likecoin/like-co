<template>
  <div class="referral-form-container" id="referral">
    <div :class="isProfileEdit ? 'section-redeem-edit-mode' : ''">
      <div class="section-title-wrapper">
        <h2 class="title">{{ $t('Edit.referral.title') }}</h2>
      </div>
      <div class="email-notice" v-if="!isEmailVerifted">{{ $t('Edit.referral.verifyEmailFirst') }}</div>
      <form v-else id="referralForm" v-on:submit.prevent="onSendEmail">

        <section class="md-layout">
          <div class="md-layout-item referral-description">{{ $t('Edit.referral.description') }}</div>
          <div class="md-layout md-layout-item referral-stat-boxes">
            <div class="md-layout-item referral-stat-box">
              <span class="referral-stat-number">{{ pending }}</span>
              <hr />
              <span class="referral-stat-description">{{ $t('Edit.referral.pending') }}</span>
            </div>
            <div class="md-layout-item referral-stat-box">
              <span class="referral-stat-number verified">{{ verified }}</span>
              <hr />
              <span class="referral-stat-description verified">
                <md-icon class="verified">check</md-icon>
                {{ $t('Edit.referral.verified') }}
              </span>
            </div>
          </div>
        </section>

        <section class="md-layout">
          <div class="md-layout-item md-size-66">
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
          <div v-if="!isProfileEdit" id="form-btn" class="md-layout-item md-size-33">
            <md-button
              class="md-raised md-primary"
              id="confirm-btn"
              type="submit"
              form="referralForm"
              :disabled="isBlocked">
              {{ $t('Edit.referral.send') }}
            </md-button>
          </div>
        </section>

        <section class="address-field">
          <div class="address-title">
            {{ $t('Edit.referral.altInvite') }}
          </div>
          <div class="md-layout ">
            <md-button
              class="md-layout-item md-primary referral-btn"
              @click="onCopy" >
              <md-icon v-if="copied" class="referral-btn-icon">check</md-icon>
              <img v-else class="referral-btn-icon" :src="LinkIcon" />
              {{ $t('Edit.referral.copyUrl') }}
            </md-button>
            <md-button
              class="md-layout-item md-primary referral-btn"
              @click="onShareFB" >
              <img class="referral-btn-icon" :src="FBIcon" />
              {{ $t('Edit.referral.facebook') }}
            </md-button>
            <md-button
              class="md-layout-item md-primary referral-btn"
              @click="onShareTwitter" >
              <img class="referral-btn-icon" :src="TwIcon" />
              {{ $t('Edit.referral.twitter') }}
            </md-button>
          </div>
        </section>

      </form>
      <input class="hidden-input" ref="shareUrl" v-model="shareUrl"/>
    </div>
  </div>
</template>

<script>
import LinkIcon from '@/assets/icons/link-icon.svg';
import FBIcon from '@/assets/icons/f-icon.svg';
import TwIcon from '@/assets/icons/t-icon.svg';

import { logTrackerEvent } from '@/util/EventLogger';
import { mapActions } from 'vuex';

export default {
  name: 'referral-action',
  props: {
    isProfileEdit: Boolean,
    isBlocked: Boolean,
    isEmailVerifted: Boolean,
    pending: Number,
    verified: Number,
    user: String,
  },
  data() {
    return {
      LinkIcon,
      FBIcon,
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
@import "../assets/index";
@import "../assets/default";

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

.section-redeem-edit-mode {
  opacity: .3;
}

.edit-form-container {
  .section-title-wrapper {
    margin-left: 40px;
  }
}

.email-notice {
  margin-top: -20px;
  padding: 40px 40px 32px;
  color: $like-gray-4;
  background-color: $like-gray-1;
  text-align: left;
  line-height: 1.5;
  font-size: 20px;
}

#referralForm {
  margin-top: -20px;
  padding: 40px 40px 32px;

  background-color: $like-gray-1;

  .referral-description {
    margin: 20px 0;
    text-align: left;
    line-height: 1.5;
    font-size: 20px;
    min-height: 140px;
    color: $like-gray-4;
  }

  .referral-stat-boxes {
    margin: 40px;
  }
  .referral-stat-box {
    text-align: center;
    margin: 16px;
    .verified {
      color: $like-green-2;
    }
    .referral-stat-number {
      font-size: 56px;
    }
    hr {
      margin: 12px;
    }
    .referral-stat-description {
      font-size: 14px;
    }
  }

  .input-redeem-hint {
    font-size: 20px;
  }

  #form-btn {
    text-align: right;

    .md-button {
      margin: 24px 0;
    }

    #confirm-btn {
      width: calc(100% - 16px);
      height: 40px;

      background-color: $like-green;

      font-size: 24px;
    }
  }

  .referral-btn {
    max-width: 256px;
    height: 40px;
    margin: 10px;
    font-size: 24px;
    color: $like-green;
    background-color: $like-white;
    .referral-btn-icon {
      padding-bottom: 5px;
      color: $like-green;
    }
  }
}
</style>
