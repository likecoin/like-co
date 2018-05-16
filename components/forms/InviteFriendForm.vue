<template>
  <div :class="['invite-friend-form', { 'full-width': isFullWidth }]">

    <copy-text-field
      :label="$t('Edit.referral.shareUrl')"
      :text="shareURL"
      @copy="onCopyURL" />

    <form :id="getFormId" v-on:submit.prevent="onSendEmail">
      <div class="text-field email">
        <label class="lc-color-like-dark-brown-1">
          {{ $t('Edit.referral.orByEmail') }}
        </label>
        <md-field class="md-likecoin no-label">
          <md-input
            v-model="email"
            :placeholder="$t('Edit.referral.emailInvite')"
            type="email"
            required />
        </md-field>
      </div>

      <div class="lc-button-group">
        <md-button
          class="md-likecoin"
          type="submit"
          :form="getFormId"
          :disabled="!email">
          {{ $t('Edit.referral.send') }}
        </md-button>
      </div>
    </form>

    <div :class="['lc-button-group lc-margin-top-16', { 'full-width': isFullWidth }]">
      <label>{{ $t('Edit.referral.altInvite') }}</label>

      <!-- <md-button
        class="md-likecoin lc-with-icon"
        v-clipboard:copy="shareURL"
        v-clipboard:success="onCopyURL">
        <md-icon v-if="hasCopiedURL">check</md-icon>
        <md-icon v-else :md-src="LinkIcon" />
        {{ $t('Edit.referral.copyUrl') }}
      </md-button>
      <br/> -->
      <md-button
        class="md-likecoin lc-facebook lc-with-icon"
        @click="onShareFacebook">
        <md-icon :md-src="FacebookIcon" />
        {{ $t('Edit.referral.facebook') }}
      </md-button>
      <br/>
      <md-button
        class="md-likecoin lc-twitter lc-with-icon"
        @click="onShareTwitter">
        <md-icon :md-src="TwitterIcon" />
        {{ $t('Edit.referral.twitter') }}
      </md-button>
    </div>

  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import LinkIcon from '@/assets/icons/fillable/link.svg';
import FacebookIcon from '@/assets/icons/fillable/facebook.svg';
import TwitterIcon from '@/assets/icons/fillable/twitter.svg';

import CopyTextField from '@/components/CopyTextField';

export default {
  name: 'invite-friend-form',
  props: {
    formId: {
      type: String,
    },
    isFullWidth: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CopyTextField,
  },
  data() {
    return {
      FacebookIcon,
      LinkIcon,
      TwitterIcon,
      hasCopiedURL: false,
      email: '',
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
    ]),
    getFormId() {
      return this.formId || 'referral-form';
    },
    shareURL() {
      return `https://like.co/ref/${this.getUserInfo.user}`;
    },
    twitterURL() {
      return `https://twitter.com/intent/tweet?hashtags=likecoin&url=${encodeURI(this.shareURL)}&text=${encodeURI(this.$t('Edit.referral.tweetContent'))}`;
    },
  },
  methods: {
    ...mapActions([
      'sendInvitationEmail',
      'setInfoMsg',
    ]),
    onInvite(type) {
      this.$emit('invite', type);
    },
    async onSendEmail() {
      await this.sendInvitationEmail({ email: this.email, user: this.getUserInfo.user });
      this.setInfoMsg(this.$t('Edit.referral.sent', { email: this.email }));
      this.email = '';
      this.onInvite('email');
    },
    onCopyURL() {
      this.hasCopiedURL = true;
      this.onInvite('url');
    },
    onShareFacebook() {
      if (window.FB && window.FB.ui) {
        window.FB.ui({
          method: 'share',
          href: this.shareURL,
        });
        this.onInvite('facebook');
      }
    },
    onShareTwitter() {
      window.open(this.twitterURL, 'twitter', 'height=285,width=550,resizable=1,noopener');
      this.onInvite('twitter');
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.invite-friend-form {
  &.full-width {
    @media (min-width: 768px + 1px) {
      .text-field {
        width: 2 / 3 * 100%;

        &.share-url {
          padding-right: 4px;
        }
      }

      > form {
        display: flex;
        align-items: center;

        .lc-button-group {
          width: calc(1 / 3 * 100% - 8px);
          margin-bottom: 10px;
          margin-left: 16px;

          > * {
            width: 100%;
            min-width: auto;
            margin: 0;
          }
        }
      }
    }
  }
}

</style>
