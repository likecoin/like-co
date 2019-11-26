<template>
  <div class="get-app-page">
    <h1 class="get-app-page__title">{{ $t('GetApp.title') }}</h1>
    <a
      class="get-app-page__download-button"
      :href="getLikerLandAppURL"
      @click="onClickDownloadApp"
    >
      {{ $t('GetApp.button.downloadNow') }}
    </a>
    <a
      class="get-app-page__continue-button"
      :href="getLikerLandURL"
      @click="onClickContinue"
    >
      {{ $t('GetApp.button.continueToWeb') }}
    </a>
    <div class="get-app-page__preview">
      <AppScreenshotPreview />
    </div>
  </div>
</template>


<script>
import AppScreenshotPreview from '~/components/AppScreenshotPreview';
import { getLikerLandAppURL, getLikerLandURL } from '@/util/api/api';
import { checkIsMobileClient } from '~/util/client';
import { logTrackerEvent } from '@/util/EventLogger';

export default {
  name: 'home',
  layout: 'app',
  components: {
    AppScreenshotPreview,
  },
  computed: {
    getLikerLandAppURL,
    getLikerLandURL,
  },
  mounted() {
    if (!checkIsMobileClient()) {
      this.$router.push({ name: 'in' });
    }
  },
  methods: {
    onClickDownloadApp() {
      logTrackerEvent(this, 'GetApp', 'ClickDownloadApp', 'ClickDownloadApp', 1);
    },
    onClickContinue() {
      logTrackerEvent(this, 'GetApp', 'ClickContinueToWeb', 'ClickContinueToWeb', 1);
    },
  },
};
</script>

<style lang="scss">
@import "~assets/variables";

.get-app-page {
  display: flex;
  align-items: center;
  flex-direction: column;

  text-align: center;

  &__title {
    padding: 20px 20px 0;

    color: $like-gray-5;

    font-size: 28px;
    font-weight: 400;
    line-height: 1.25;
  }

  &__download-button {
    margin: 20px;
    padding: 12px 14px;

    text-decoration: none !important;

    color: $like-green;
    border: 1px solid currentColor;
    border-radius: 12px;

    font-weight: 600;
  }

  &__continue-button {
    text-decoration: underline !important;

    color: $like-green;

    font-size: 12px;
  }

  &__preview {
    width: 236px;
    margin: 20px;
  }
}
</style>
