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
            {{ $t('Mission.registerOice.label.verifying') }}
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

        <div class="instruction-image">
          <img :src="image">
        </div>

        <div class="lc-dialog-container-1">
          <div class="lc-button-group">
            <md-button
              :class="[
                'md-likecoin',
                {
                  outline: step < 2,
                },
              ]"
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
      isLoading: true,
      errorMessage: '',
    };
  },
  computed: {
    title() {
      return this.$t(`Mission.registerOice.step.${this.step}.title`);
    },
    description() {
      return this.$t(`Mission.registerOice.step.${this.step}.description`);
    },
    image() {
      switch (this.step) {
        case 0:
          return '/images/mission/oice/register.png';
        default:
          return '/images/mission/oice/connect-likecoin.gif';
      }
    },
    buttonText() {
      return this.$t(`Mission.registerOice.step.${this.step}.button`);
    },
  },
  mounted() {
    this.onComplete({ isSlient: true });
  },
  methods: {
    nextStep(max = 2) {
      if (this.step < max) this.step += 1;
    },
    onCancel() {
      this.$emit('cancel');
    },
    onClickButton() {
      switch (this.step) {
        case 0:
          openURL(this, 'https://oice.com/login', 'oice');
          break;
        case 1:
          openURL(this, 'https://oice.com/profile', 'oice');
          break;
        case 2:
          this.onComplete();
          break;
        default:
      }
      this.nextStep();
    },
    async onComplete({ isSlient } = { isSlient: false }) {
      this.isLoading = true;
      try {
        await apiPostRegisterOiceMission(this.userId);
        this.$emit('complete');
      } catch (error) {
        if (!isSlient) {
          if (error.response) {
            const { data, statusText } = error.response;
            const localeKey = `Error.${data || statusText}`;
            this.errorMessage = this.$te(localeKey) ? this.$t(localeKey) : data || statusText;
          }
          this.isError = true;
        }
      }
      this.isLoading = false;
    },
  },
};
</script>
