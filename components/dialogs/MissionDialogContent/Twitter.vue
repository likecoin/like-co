<template>
  <div class="twitter-mission">
    <transition name="lc-transition-default" mode="out-in">

      <div v-if="isError" key="error" class="lc-dialog-container-0">
        <div class="lc-dialog-container-1">
          <p class="lc-font-size-16 lc-text-align-center lc-margin-vertical-32">
            {{ $t('Error.MISSION_COMPLETE_FAILURE') }}
          </p>
        </div>

        <div class="lc-button-group">
          <md-button
            class="md-likecoin"
            @click="onCancel">
            {{ $t('General.button.ok') }}
          </md-button>
        </div>
      </div>

      <div v-else-if="isLoading" class="lc-dialog-container-0">
        <div class="lc-dialog-container-1 lc-padding-vertical-32">
          <spinner :size="48" />
        </div>
      </div>

      <div v-else key="normal" class="lc-dialog-container-0">
        <div class="lc-dialog-container-1">
          <h1 class="lc-font-size-32">{{ title }}</h1>
        </div>

        <div class="instruction-image">
          <img :src="image" />
        </div>

        <div class="lc-dialog-container-1">
          <retweet-form
            :step.sync="step"
            @cancel="onCancel"
            @complete="onComplete" />
        </div>
      </div>

    </transition>
  </div>
</template>


<script>
import * as api from '@/util/api/api';

import RetweetForm from '~/components/forms/RetweetForm';
import Spinner from '~/components/Spinner';

export default {
  name: 'twitter-mission',
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  components: {
    RetweetForm,
    Spinner,
  },
  data() {
    return {
      step: 0,
      isError: false,
      isLoading: false,
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
      return `/images/mission/twitter/quote-tweet-${this.step === 2 ? 2 : 1}.png`;
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
        console.error(error);
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
