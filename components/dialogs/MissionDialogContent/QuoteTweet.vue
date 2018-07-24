<template>
  <div class="quote-tweet-mission">
    <transition
      name="lc-transition-default"
      mode="out-in"
    >

      <div
        v-if="isError"
        key="error"
        class="lc-dialog-container-0"
      >
        <div class="lc-dialog-container-1">
          <p class="lc-font-size-16 lc-text-align-center lc-margin-vertical-32">
            {{ $t('Error.MISSION_COMPLETE_FAILURE') }}
            <span v-if="errorMessage"><br><br>{{ errorMessage }}</span>
          </p>
        </div>

        <div class="lc-button-group">
          <md-button
            class="md-likecoin"
            @click="onCancel"
          >
            {{ $t('General.button.ok') }}
          </md-button>
        </div>
      </div>

      <div
        v-else-if="isLoading"
        class="lc-dialog-container-0"
      >
        <div class="lc-dialog-container-1 lc-padding-vertical-32">
          <spinner :size="48" />
          <p class="lc-margin-top-24 lc-text-align-center">
            {{ $t('Mission.twitter.label.verifying') }}
          </p>
        </div>
      </div>

      <div
        v-else
        key="normal"
        class="lc-dialog-container-0"
      >
        <div class="lc-dialog-container-1">
          <h1 class="lc-font-size-32">{{ title }}</h1>
          <p
            class="lc-font-size-16 lc-color-like-gray-4"
            v-html="$t('Mission.twitter.linkedDescription', { postLink: TWEET_URL } )"
          />
        </div>

        <div class="instruction-image">
          <img :src="image">
        </div>

        <div class="lc-dialog-container-1">
          <quote-tweet-form
            :step.sync="step"
            :url="TWEET_URL"
            :comment="comment"
            @cancel="onCancel"
            @complete="onComplete"
          />
        </div>
      </div>

    </transition>
  </div>
</template>


<script>
import * as api from '@/util/api/api';

import QuoteTweetForm from '~/components/forms/QuoteTweetForm';
import Spinner from '~/components/Spinner';

const TWEET_URL = 'https://twitter.com/likecoin_fdn/status/998505329854836738';

export default {
  name: 'quote-tweet-mission',
  components: {
    QuoteTweetForm,
    Spinner,
  },
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      TWEET_URL,

      step: 0,
      isError: false,
      isLoading: false,
      errorMessage: '',
    };
  },
  computed: {
    title() {
      switch (this.step) {
        case 2:
          return this.$t('Mission.twitter.header.pasteURL');
        default:
          return this.$t('Mission.twitter.title');
      }
    },
    image() {
      return `/images/mission/twitter/quote-tweet-${this.step === 2 ? 2 : 1}.gif`;
    },
    comment() {
      return `Join: http://like.co/ref/${this.userId}`;
    },
  },
  methods: {
    onCancel() {
      this.$emit('cancel');
    },
    async onComplete(tweetLink) {
      this.isLoading = true;
      try {
        await api.apiPostTwitterMission(this.userId, tweetLink);
        this.$emit('complete');
      } catch (error) {
        if (error.response) {
          const { data, statusText } = error.response;
          const localeKey = `Error.${data || statusText}`;
          this.errorMessage = this.$te(localeKey) ? this.$t(localeKey) : data || statusText;
        }
        this.isError = true;
      }
      this.isLoading = false;
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.instruction-image {
  display: block;

  min-width: 418px;
  padding: 16px 16px 24px;

  > img {
    border: solid 2px #E6E6E6;
    border-radius: 8px;
    background-color: $like-gray-1;
  }

  @media (max-width: 600px) {
    min-width: 100%;
  }
}
</style>
