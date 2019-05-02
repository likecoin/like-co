<template>
  <div class="quote-tweet-form">

    <copy-text-field
      v-if="currentStep < 2"
      :label="$t('Form.Retweet.label.retweet')"
      :text="text"
      @copy="onCopy"
    />

    <div v-else>
      <label class="lc-color-like-dark-brown-1">
        {{ $t('Form.Retweet.label.pasteURL') }}
      </label>
      <md-field class="md-likecoin no-label">
        <md-input
          v-model="retweetLink"
          :placeholder="$t('Form.Retweet.placeholer.tweetLink')"
        />
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
        @click="onClickButton"
      >
        <md-icon
          v-if="currentStep < 2"
          :md-src="TwitterIcon"
        />
        {{ buttonText }}
      </md-button>
      <br>
      <md-button
        class="md-likecoin lc-cancel"
        @click="$emit('cancel')"
      >
        {{ $t('General.button.cancel') }}
      </md-button>
    </div>
  </div>
</template>


<script>
import { openURL } from '@/util/client';

import TwitterIcon from '@/assets/icons/fillable/twitter.svg';

import CopyTextField from '@/components/CopyTextField';

export default {
  name: 'quote-tweet-form',
  components: {
    CopyTextField,
  },
  props: {
    step: {
      type: Number,
      default: 0,
    },
    url: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      default: '',
    },
    hashtags: {
      type: Array,
      default: () => ['LikeCoin'],
    },
  },
  data() {
    return {
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
    hashtagsString() {
      return this.hashtags.reduce((s, t) => `${s} #${t}`, '').trim();
    },
    indentURL() {
      return this.url;
      // return `https://twitter.com/intent/tweet?hashtags=${this.hashtags.join()}&url=${encodeURI(this.url)}&text=${encodeURI(this.comment)}`; // NOTE: Temporary
    },
    text() {
      return [
        this.comment,
        // this.url, // NOTE: Temporary
        this.hashtagsString,
      ].reduce((text, t) => (t ? `${text} ${t}` : text));
    },
  },
  methods: {
    nextStep(max = 2) {
      if (this.currentStep < max) this.currentStep += 1;
      this.$emit('update:step', this.currentStep);
    },
    onCopy() {
      // this.nextStep(1); // NOTE: Temporary
    },
    onClickButton() {
      switch (this.currentStep) {
        case 0:
          openURL(this, this.indentURL, 'twitter', 'height=285,width=550,resizable=1,noopener');
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

<style lang="scss" scoped>
.copy-text-field.md-field.md-has-value {
  /deep/ .md-input {
    font-size: 14px;
  }
}
</style>
