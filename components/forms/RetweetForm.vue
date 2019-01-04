<template>
  <div class="retweet-form">

    <div v-if="currentStep === 1">
      <label class="lc-color-like-dark-brown-1">
        {{ $t('Form.Retweet.label.enterUsername') }}
      </label>
      <md-field class="md-likecoin username-text-field">
        <span class="md-prefix">@</span>
        <md-input
          v-model="username"
          ref="inputText"
          :disabled="currentStep === 0"
        />
      </md-field>
    </div>

    <div class="lc-button-group">
      <md-button
        :class="[
          'md-likecoin lc-with-icon',
          {
            'lc-twitter': currentStep !== 1,
            outline: currentStep === 0,
          },
        ]"
        :disabled="currentStep === 1 && !username"
        @click="onClickButton"
      >
        <md-icon
          v-if="currentStep === 0"
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

// import CopyTextField from '@/components/CopyTextField';

export default {
  name: 'retweet-form',
  // components: {
  //   CopyTextField,
  // },
  props: {
    step: {
      type: Number,
      default: 0,
    },
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      TwitterIcon,

      currentStep: this.step,
      username: '',
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
    nextStep(max = 1) {
      if (this.currentStep < max) this.currentStep += 1;
      this.$emit('update:step', this.currentStep);
    },
    onClickButton() {
      switch (this.currentStep) {
        case 0:
          openURL(this, this.url, 'twitter', 'height=285,width=550,resizable=1,noopener');
          break;
        case 1:
          this.$emit('complete', this.username);
          break;
        default:
      }
      this.nextStep();
    },
  },
};
</script>

<style lang="scss" scoped>
.username-text-field {
  min-height: 0;
  padding-top: 0;
}
</style>
