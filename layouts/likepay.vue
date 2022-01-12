<template>
  <div class="lc-layout">
    <tool-bars />

    <div class="likepay-container">
      <nuxt />
    </div>

  </div>
</template>

<script>
import localeMixin from '~/mixins/locale';

import ToolBars from '~/components/toolbars/ToolBars';

export default {
  components: {
    ToolBars,
  },
  mixins: [localeMixin],
  head() {
    return {
      htmlAttrs: {
        layout: 'likepay-layout',
      },
    };
  },
};
</script>

<style lang="scss">
@import '~assets/variables';

$section-padding: 32px;
$body-width: 340px;

html[layout=likepay-layout] {
  background-color: $like-green !important;

  body {
    background: transparent !important;
  }

  .likepay-container {
    color: white;

    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    font-weight: 400;
  }

  .likepay-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    width: 100%;
    min-height: 100vh;

    @media screen and (min-width: $body-width) {
      justify-content: center;

      max-width: 400px;
      margin: 0 auto;
      padding: 8px;
    }

    &--center {
      align-items: center;
      justify-content: center;
    }
  }

  .likepay-text-panel {
    padding: $section-padding;

    text-align: center;

    font-size: 24px;
    font-weight: 600;
    line-height: 1.2;
  }

  .wordpress-panel {
    overflow: hidden;
    max-width: 400px;
    min-width: 400px;
    color: #4a4a4a;
    background-color: #fff;

    @media screen and (min-width: $body-width) {
      border-radius: 14px;

      box-shadow: 0px 5px 20px -5px rgba(0,0,0,0.4);
    }

    &__section-container {
      padding: $section-padding;
    }
    &__section-dropdown-container {
      background-color: #e5faf7;
    }

    &__section-collapsible {
      overflow: hidden;

      max-height: 100vh;

      transition: max-height 2s ease;

      &--collapsed {
        max-height: 0
      }
    }

    &__section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__header-title {
      font-size: 1em;
      font-weight: 600;
    }
    &__header-icon {
      height: 52px;
      fill: #28646e;
    }

    &__section-amount {
      margin-top: 20px;

      border-top: 1px solid #979797;
    }
    &__section-amount-text {
      margin-top: 4px;

      font-size: 2em;
      font-weight: 600;
      line-height: 1.5em;
    }
    &__section-meta:not(:first-child) {
      margin-top: 18px;
    }
    &__section-meta-label {
      color: #9b9b9b;

      font-size: 14px;
    }

    &__user {
      display: flex;
      align-items: center;

      padding: 8px 16px;

      transition: background-color 0.2s ease;

      text-decoration: none !important;

      border: 1px solid #e6e6e6;
      border-radius: 12px;

      background-color: rgba(white, 0);

      &:hover {
        background-color: #f1f1f1;
      }
      &:active {
        background-color: #e8e8e8;
      }
    }
    &__user-avatar {
      width: 32px;
    }
    &__user-display-name {
      margin-left: 12px;

      font-weight: 600;
    }

    &__section-meta-value {
      margin-top: 2px;

      font-size: 20px;
      font-weight: 600;
      line-height: 1.5;
    }

    &__dropdown-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      width: 100%;
      padding: #{$section-padding / 2} $section-padding;

      transition: color 0.2s ease, background-color 0.2s ease;

      color: #28646e;
      border: none;
      background: none;

      &:hover {
        color: darken(#28646e, 10);

        background-color: darken(#e5faf7, 5);
      }
    }
    &__dropdown-header-text {
      font-weight: 600;
    }
    &__dropdown-arrow {
      fill: currentColor;

      width: 24px;
      height: 24px;

      background: transparent;
    }
    &__dropdown-body {
      box-sizing: border-box;
      padding: 0 $section-padding;

      &:first-child {
        padding-top: 8px;
      }

      > div {
        padding: 8px 0 $section-padding;
      }
    }

    &__section-meta-grid {
      display: flex;
      align-content: flex-start;
      flex-wrap: wrap;

      margin: -8px;
    }
    &__section-meta-grid-item {
      width: 100%;
      padding: 8px;

      &--half {
        width: 50%;
      }
    }
    &__section-meta-grid-item-label {
      color: #9b9b9b;

      font-size: 12px;
      line-height: 1.2em;
    }
    &__section-meta-grid-item-value {
      margin-top: 8px;

      font-weight: 600;

      &--fingerprint {
        word-break: break-all;

        font-family: 'Courier New', Courier, monospace;
      }
    }

    &__footer {
      display: flex;
      align-items: center;
      flex-direction: column;

      margin-top: 16px;
      padding-top: 8px;

      border: none;
    }
  }

  .likepay-panel {
    overflow: hidden;

    color: #4a4a4a;
    background-color: #fff;

    @media screen and (min-width: $body-width) {
      border-radius: 14px;

      box-shadow: 0px 5px 20px -5px rgba(0,0,0,0.4);
    }

    &__section-container {
      padding: $section-padding;
    }
    &__section-dropdown-container {
      background-color: #e5faf7;
    }

    &__section-collapsible {
      overflow: hidden;

      max-height: 100vh;

      transition: max-height 2s ease;

      &--collapsed {
        max-height: 0
      }
    }

    &__section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__header-title {
      font-size: 1em;
      font-weight: 600;
    }
    &__header-icon {
      height: 52px;
      fill: #28646e;
    }

    &__section-amount {
      margin-top: 20px;

      border-top: 1px solid #979797;
    }
    &__section-amount-text {
      margin-top: 4px;

      font-size: 2em;
      font-weight: 600;
      line-height: 1.5em;
    }
    &__section-meta:not(:first-child) {
      margin-top: 18px;
    }
    &__section-meta-label {
      color: #9b9b9b;

      font-size: 14px;
    }

    &__user {
      display: flex;
      align-items: center;

      padding: 8px 16px;

      transition: background-color 0.2s ease;

      text-decoration: none !important;

      border: 1px solid #e6e6e6;
      border-radius: 12px;

      background-color: rgba(white, 0);

      &:hover {
        background-color: #f1f1f1;
      }
      &:active {
        background-color: #e8e8e8;
      }
    }
    &__user-avatar {
      width: 32px;
    }
    &__user-display-name {
      margin-left: 12px;

      font-weight: 600;
    }

    &__section-meta-value {
      margin-top: 2px;

      font-size: 20px;
      font-weight: 600;
      line-height: 1.5;
    }

    &__dropdown-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      width: 100%;
      padding: #{$section-padding / 2} $section-padding;

      transition: color 0.2s ease, background-color 0.2s ease;

      color: #28646e;
      border: none;
      background: none;

      &:hover {
        color: darken(#28646e, 10);

        background-color: darken(#e5faf7, 5);
      }
    }
    &__dropdown-header-text {
      font-weight: 600;
    }
    &__dropdown-arrow {
      fill: currentColor;

      width: 24px;
      height: 24px;

      background: transparent;
    }
    &__dropdown-body {
      box-sizing: border-box;
      padding: 0 $section-padding;

      &:first-child {
        padding-top: 8px;
      }

      > div {
        padding: 8px 0 $section-padding;
      }
    }

    &__section-meta-grid {
      display: flex;
      align-content: flex-start;
      flex-wrap: wrap;

      margin: -8px;
    }
    &__section-meta-grid-item {
      width: 100%;
      padding: 8px;

      &--half {
        width: 50%;
      }
    }
    &__section-meta-grid-item-label {
      color: #9b9b9b;

      font-size: 12px;
      line-height: 1.2em;
    }
    &__section-meta-grid-item-value {
      margin-top: 8px;

      font-weight: 600;

      &--fingerprint {
        word-break: break-all;

        font-family: 'Courier New', Courier, monospace;
      }
    }

    &__footer {
      display: flex;
      align-items: center;
      flex-direction: column;

      margin-top: 16px;
      padding-top: 8px;

      border: none;
    }
  }

  .likepay-block-button {
    min-width: 256px;
    min-height: 40px;
    padding: 12px;

    transition: background-color 0.2s ease, color 0.2s ease;

    color: #28646E;
    border-radius: 12px;
    background-color: #AAF1E7;

    font-size: 20px;

    &:hover {
      color: darken(#28646E, 10);
      background-color: darken(#AAF1E7, 10);
    }

    &:active {
      background-color: darken(#AAF1E7, 20);
    }
  }
}
</style>
