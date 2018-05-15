<template>
  <div class="retweet-form">

    <copy-text-field
      v-if="currentStep < 2"
      :label="$t('Form.Retweet.label.retweet')"
      :text="`${TWEET_COMMENT} ${TWEET_URL} #${TWEET_HASHTAG}`"
      @copy="onCopy" />

    <div v-else>
      <label class="lc-color-like-dark-brown-1">
        {{ $t('Form.Retweet.label.pasteURL') }}
      </label>
      <md-field class="md-likecoin no-label">
        <md-input
          v-model="retweetLink"
          :placeholder="$t('Form.Retweet.placeholer.tweetLink')" />
      </md-field>
    </div>

    <div class="lc-button-group">
      <md-button
        :class="[
          'md-likecoin lc-with-icon',
          {
            'lc-twitter': currentStep !== 2,
            outline: currentStep === 0,
          },
        ]"
        :disabled="currentStep === 2 && !retweetLink"
        @click="onClickButton">
        <md-icon v-if="currentStep < 2" :md-src="TwitterIcon" />
        {{ buttonText }}
      </md-button>
      <br/>
      <md-button
        class="md-likecoin lc-cancel"
        @click="$emit('cancel')">
        {{ $t('General.button.cancel') }}
      </md-button>
    </div>
  </div>
</template>


<script>
import { openURL } from '@/util/client';

import TwitterIcon from '@/assets/icons/fillable/twitter.svg';

import CopyTextField from '@/components/CopyTextField';

const TWEET_URL = 'https://twitter.com/likecoin_fdn/status/993685600443162630';
const TWEET_COMMENT = 'Reinventing the Like';
const TWEET_HASHTAG = 'LikeCoin';
const WEB_INDENT_URL = `https://twitter.com/intent/tweet?hashtags=${TWEET_HASHTAG}&url=${encodeURI(TWEET_URL)}&text=${encodeURI(TWEET_COMMENT)}`;

export default {
  name: 'retweet-form',
  props: {
    step: {
      type: Number,
      default: 0,
    },
  },
  components: {
    CopyTextField,
  },
  data() {
    return {
      TWEET_URL,
      TWEET_COMMENT,
      TWEET_HASHTAG,
      TwitterIcon,

      currentStep: this.step,
      retweetLink: '',
    };
  },
  computed: {
    buttonText() {
      switch (this.currentStep) {
        case 0:
          return this.$t('Form.Retweet.button.retweet');
        default:
          return this.$t('General.button.done');
      }
    },
  },
  methods: {
    nextStep(max = 2) {
      if (this.currentStep < max) this.currentStep += 1;
      this.$emit('update:step', this.currentStep);
    },
    onCopy() {
      this.nextStep(1);
    },
    onClickButton() {
      switch (this.currentStep) {
        case 0:
          openURL(this, WEB_INDENT_URL, 'twitter', 'height=285,width=550,resizable=1,noopener');
          break;
        case 2:
          this.$emit('complete', this.retweetLink);
          break;
        default:
      }
      this.nextStep();
    },
  },
};
</script>
