<template>
  <md-dialog
    :md-active="isShow"
    v-bind="$testID('WalletNoticeDialog')"
    class="wallet-notice-dialog"
    @update:md-active="updateIsShow"
  >

    <!-- Header Navigation -->
    <div class="wallet-notice-dialog__header-navigation lc-padding-vertical-16">
      <md-button
        class="wallet-notice-dialog__back-button"
        @click="onCancel"
      >
        <md-icon>arrow_back</md-icon>
        <span>{{ cancelTitle || $t('General.button.cancel') }}</span>
      </md-button>
    </div>

    <md-dialog-content>

      <!-- Banner Section -->
      <transition-group
        tag="div"
        class="wallet-notice-dialog__banner"
        name="wallet-notice-dialog__banner-"
        mode="out-in"
        @enter="setContentHeight"
      >
        <img
          :key="pageIndex"
          :class="[
            `wallet-notice-dialog__banner--${pageIndex + 1}`,
            isLoadingBanner && 'wallet-notice-dialog__banner--loading',
          ]"
          :src="banner"
          @load="isLoadingBanner = false"
        >
      </transition-group>

      <!-- Title Section -->
      <transition-group
        tag="div"
        class="wallet-notice-dialog__title"
        name="wallet-notice-dialog__title-"
      >
        <h1 :key="pageIndex"><span>{{ title }}</span></h1>
      </transition-group>

      <!-- Content Section  -->
      <transition-group
        :style="contentStyle"
        tag="div"
        class="wallet-notice-dialog__content-wrapper"
        name="wallet-notice-dialog__content-"
      >
        <!-- Page 1 -->
        <div
          v-if="pageIndex === 0"
          ref="page1"
          :key="1"
          class="wallet-notice-dialog__content"
        >
          <p class="wallet-notice-dialog__content__description">
            {{ $t('WalletNoticeDialog.page[0].description') }}
          </p>
          <ul class="wallet-notice-dialog__content__list">
            <!-- 3 list items -->
            <li
              v-for="i in 3"
              :key="i"
            >
              <span>{{ $t(`WalletNoticeDialog.page[0].bullet[${i - 1}]`) }}</span>
            </li>
          </ul>
        </div>

        <!-- Page 2 -->
        <div
          v-else-if="pageIndex === 1"
          ref="page2"
          :key="2"
          class="wallet-notice-dialog__content"
        >
          <p class="wallet-notice-dialog__content__description">
            {{ $t('WalletNoticeDialog.page[1].description[0]') }}
          </p>
          <p class="wallet-notice-dialog__content__description md-layout">
            <img
              :src="getAsset('./protect.svg')"
              :style="{
                width: '54px',
                margin: '8px',
              }"
            >
            <span
              :style="{ color: '#6E2828' }"
              class="md-layout-item"
            >
              {{ $t('WalletNoticeDialog.page[1].description[1]') }}
            </span>
          </p>
        </div>

        <!-- Page 3 -->
        <div
          v-else-if="pageIndex === 2"
          ref="page3"
          :key="3"
          class="wallet-notice-dialog__content"
        >
          <p class="wallet-notice-dialog__content__description">
            {{ $t('WalletNoticeDialog.page[2].description[0]') }}
          </p>
          <p class="wallet-notice-dialog__content__description">
            {{ $t('WalletNoticeDialog.page[2].description[1]') }}
          </p>
        </div>
      </transition-group>

      <!-- Proceed Button -->
      <div class="lc-dialog-container-1 lc-button-group">
        <md-button
          v-bind="$testID('ProceedWalletNoticeButton')"
          class="md-likecoin"
          @click="onProceed"
        >
          {{ proceedButtonText }}
        </md-button>
      </div>

    </md-dialog-content>

    <!-- Page Control -->
    <div class="wallet-notice-dialog__page-control-wrapper">
      <div class="wallet-notice-dialog__page-control lc-padding-vertical-16">
        <div class="wallet-notice-dialog__page-control__indicator-container">
          <span
            v-for="i in PAGE_COUNT"
            :key="i"
            :class="[
              'wallet-notice-dialog__page-control__indicator',
              {
                'wallet-notice-dialog__page-control__indicator--active': pageIndex === i - 1,
              },
            ]"
          />
        </div>
      </div>
    </div>

  </md-dialog>
</template>

<script>
const getAsset = require.context('../../assets/wallet-notice/');

const PAGE_COUNT = 3;

export default {
  name: 'wallet-notice-dialog',
  props: {
    isShow: {
      type: [Boolean, String],
      default: false,
    },
    cancelTitle: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      PAGE_COUNT,

      pageIndex: 0,
      isLoadingBanner: true,

      contentStyle: {
        height: '200px',
      },
    };
  },
  computed: {
    banner() {
      return getAsset(`./banner/${this.pageIndex + 1}.svg`);
    },
    title() {
      return this.$t(`WalletNoticeDialog.page[${this.pageIndex}].title`);
    },
    proceedButtonText() {
      return this.$t(
        this.pageIndex < PAGE_COUNT - 1
          ? 'General.button.next'
          : 'WalletNoticeDialog.startUsing',
      );
    },
  },
  watch: {
    isShow(isShow, prevIsShow) {
      if (!prevIsShow && isShow) {
        if (this.pageIndex === 0) {
          this.$nextTick(this.setContentHeight);
        }
        this.pageIndex = 0;
      }
    },
    pageIndex() {
      this.isLoadingBanner = true;
      this.$nextTick(this.setContentHeight);
    },
  },
  mounted() {
    this.setContentHeight();
  },
  methods: {
    getAsset,
    updateIsShow(isShow) {
      this.$emit('update:is-show', isShow);
    },
    setContentHeight() {
      const elem = this.$refs[`page${this.pageIndex + 1}`];
      if (elem) {
        this.contentStyle = {
          height: `${elem.offsetHeight}px`,
        };
      }
    },
    onCancel() {
      this.$emit('cancel');
      this.updateIsShow(false);
    },
    onProceed() {
      if (this.pageIndex < PAGE_COUNT - 1) {
        this.pageIndex += 1;
      } else {
        this.$emit('confirm');
        this.updateIsShow(false);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/variables';

.wallet-notice-dialog {
  z-index: 11;

  @media screen and (min-width: 600px + 1px) {
    min-width: 544px;

    border-radius: 8px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  }

  &__header-navigation {
    border-bottom: 2px solid $gray-e6;
  }

  &__back-button {
    :global(.md-button-content) {
      display: flex;
      align-items: center;
    }

    .md-icon {
      margin-right: 8px;
    }
  }

  &__banner {
    position: relative;

    overflow: hidden;

    height: 232px;

    @media screen and (max-width: 600px) {
      height: 42vw;
    }

    &-- {
      &loading,
      &enter {
        transform: translateY(50%) rotateZ(90deg);

        &.wallet-notice-dialog__banner--1 {
          transform: translateY(50%);
        }
      }
      &leave-to {
        transform: translateY(50%) rotateZ(-90deg);
      }
      &loading,
      &enter,
      &leave-to {
        opacity: 0;
      }
    }

    img {
      position: absolute;

      display: block;

      width: 100%;
      height: 100%;

      transition-timing-function: ease-in-out;
      transition-duration: 0.5s;
      transition-property: opacity, transform;
      transform-origin: center 200%;
    }
  }

  &__title {
    position: relative;

    overflow: hidden;

    height: 80px;

    background-image: linear-gradient(249deg, #d2f0f0, #f0e6b4);

    &-- {
      &enter-active,
      &leave-active {
        transition: transform 0.5s ease-in-out;
      }
      &enter {
        transform: translateY(100%);
      }
      &leave-to {
        transform: translateY(-100%);
      }
    }

    h1 {
      position: absolute;

      display: flex;
      align-items: center;
      justify-content: center;

      width: 100%;
      height: 100%;

      text-align: center;
      letter-spacing: -0.2px;

      color: $like-dark-brown-2;

      font-size: 28px;
      font-weight: 400;

      @media screen and (max-width: 600px) {
        font-size: 24px;
      }
    }
  }

  &__content-wrapper {
    position: relative;

    overflow: hidden;

    transition: height 0.5s ease-in-out;
  }
  &__content {
    position: absolute;

    width: 100%;
    padding: 24px;

    @media screen and (max-width: 600px) {
      padding: 16px;
    }

    &-- {
      &enter-active,
      &leave-active {
        transition: transform 0.5s ease-in-out;
      }
      &enter {
        transform: translateX(100%);
      }
      &leave-to {
        transform: translateX(-100%);
      }
    }

    &__description {
      margin-top: 24px;
      margin-bottom: 24px;

      color: $like-gray-4;

      font-size: 16px;
      line-height: 1.63;

      &--warning {
        color: $like-brown;
      }

      @media screen and (max-width: 600px) {
        margin-top: 16px;
        margin-bottom: 16px;

        font-size: 12px;
        line-height: 1.5;
      }
    }

    &__list {
      list-style: none;

      li {
        &::before {
          display: block;

          width: 6px;
          height: 6px;
          margin: 6px 24px;

          content: "";

          border-radius: 50%;

          background: $like-green-2;
        }

        display: flex;

        color: $like-gray-5;

        font-size: 18px;

        &:not(:first-of-type) {
          margin-top: 24px;
        }

        @media screen and (max-width: 600px) {
          &::before {
            width: 3px;
            height: 3px;
            margin: 4px 8px;
          }

          font-size: 14px;

          &:not(:first-of-type) {
            margin-top: 16px;
          }
        }
      }
    }
  }

  &__page-control-wrapper {
    position: relative;
    z-index: 4;

    pointer-events: none;
  }
  &__page-control {
    position: absolute;
    right: 0;
    bottom: -1px;
    left: 0;

    display: flex;
    justify-content: center;

    padding: 2px;

    background: linear-gradient(to top, white, transparentize(white, 1));

    &__indicator-container {
      display: inherit;

      padding: 2px;

      pointer-events: all;

      border-radius: 9999px;
      background: white;
      box-shadow: 0 0 10px 0 white;
    }
    &__indicator {
      width: 3px;
      height: 3px;

      margin: 2px 4px;

      transition-duration: 0.5s;
      transition-property: background-color, transform;

      border-radius: 50%;
      background-color: $gray-9b;

      &--active {
        transform: scale(1.67);

        background-color: $like-green;
      }
    }
  }
}

.md-dialog-content {
  padding: 0 0 36px;
}
</style>
