<template>
  <div class="connect-oice-mission">
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
        key="loading"
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
            v-html="description"
          />
        </div>

        <div class="lc-dialog-container-1 lc-margin-top-16">
          <div class="lc-button-group">
            <md-button
              class="md-likecoin"
              @click="onClickButton"
            >
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
      </div>

    </transition>

  </div>
</template>


<script>
import { apiPostRegisterOiceMission } from '~/util/api/api';
import { openURL } from '~/util/client';

import Spinner from '~/components/Spinner';

export default {
  name: 'connect-oice-mission',
  components: {
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
      step: 0,
      isError: false,
      isLoading: false,
      errorMessage: '',
    };
  },
  computed: {
    title() {
      switch (this.step) {
        default:
          return this.$t('Mission.registerOice.title');
      }
    },
    description() {
      switch (this.step) {
        default:
          return this.$t(`Mission.registerOice.step.${this.step + 1}.description`);
      }
    },
    buttonText() {
      switch (this.step) {
        case 0:
          return this.$t('General.button.next');
        default:
          return this.$t('General.button.done');
      }
    },
  },
  methods: {
    onCancel() {
      this.$emit('cancel');
    },
    nextStep(max = 1) {
      if (this.step < max) this.step += 1;
    },
    onClickButton() {
      switch (this.step) {
        case 0:
          openURL(this, 'https://oice.com/profile', 'oice');
          break;
        case 1:
          this.onComplete();
          break;
        default:
      }
      this.nextStep();
    },
    async onComplete() {
      this.isLoading = true;
      try {
        await apiPostRegisterOiceMission(this.userId);
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
