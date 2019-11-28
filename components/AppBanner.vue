<template>
  <div class="app-banner">
    <h2 class="app-banner__title">{{ $t('AppBanner.title') }}</h2>
    <div class="lc-container-3 lc-bg-gray-1">
      <div class="app-banner__feature-list">
        <ul>
          <li
            v-for="value in $t('AppBanner.features')"
            :key="value"
          >
            <img
              class="bullet"
              src="~/assets/tokensale/tick.svg"
              role="presentation"
            >
            <div>{{ value }}</div>
          </li>
        </ul>
      </div>
      <AppScreenshotPreview class="app-banner__screenshots" />
      <div class="app-banner__cta">
        <div
          class="app-banner__cta-qrcode"
          :style="{ backgroundImage: `url(${qrcodePath})` }"
        >
          <a
            class="app-banner__cta-download-button"
            :href="getLikerLandAppURL"
          >{{ $t('AppBanner.downloadButtonText') }}</a>
        </div>
        <div class="app-banner__cta-platform-badges">
          <a
            href="https://apps.apple.com/app/likerland/id1248232355"
            target="_blank"
          >
            <img src="~/assets/app/app-store.svg">
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.oice"
            target="_blank"
          >
            <img src="~/assets/app/google-play.svg">
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppScreenshotPreview from '~/components/AppScreenshotPreview';
import QRCode from '~/assets/app/qrcode.svg';

import { getLikerLandAppURL } from '@/util/api/api';

export default {
  name: 'app-banner',
  components: {
    AppScreenshotPreview,
  },
  computed: {
    getLikerLandAppURL,
    qrcodePath() {
      return QRCode;
    },
  },
};
</script>

<style lang="scss">
@import '~assets/variables';

.app-banner {
  padding-bottom: 72px;

  &__title {
    margin-bottom: 48pt;

    text-align: center;

    font-size: 32pt;
    font-weight: 300;
  }

  .lc-container-3 {
    display: flex;

    > * {
      flex: 1;
    }

    @media screen and (max-width: 768px) {
      align-items: center;
      flex-direction: column;

      > * {
        flex: unset;
      }
    }
  }

  &__feature-list {
    display: flex;
    align-items: center;

    padding: 24pt 0;

    ul {
      margin: 0;

      list-style: none;

      li {
        display: flex;
        align-items: flex-start;

        &:not(:first-child) {
          margin-top: 10pt;
        }

        img.bullet {
          height: 14pt;
          margin-right: 8pt;
        }
      }
    }
  }

  &__screenshots {
    max-width: 192px;
    margin: -30px 24px -72px;

    @media screen and (max-width: 768px) {
      width: 100%;
      margin: 24px;
    }
  }

  &__cta {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__cta-qrcode {
    position: relative;

    width: 170px;
    height: 170px;

    @media screen and (max-width: 768px) {
      margin-bottom: 44px;
    }
  }

  &__cta-download-button {
    position: absolute;
    top: 100%;

    width: 100%;
    margin-top: 12px;

    text-align: center;

    color: $gray-9b !important;

    font-size: 12pt;
    font-weight: 600;
  }

  &__cta-platform-badges {
    position: absolute;
    top: 100%;

    display: flex;
    justify-content: center;

    margin-top: 12px;

    > * {
      margin: 8px;
    }

    @media screen and (max-width: 768px) {
      align-items: center;
      flex-direction: column;

      margin-bottom: 36px;
    }
  }
}
</style>
