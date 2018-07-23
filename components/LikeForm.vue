<template>
  <div class="like-form">

    <header class="like-form__header">
      <div class="like-form__header__left">
        <slot name="header-left" />
      </div>

      <img
        :src="LikeCoinIcon"
        class="like-form__header__icon"
      >

      <div class="like-form__header__right">
        <slot name="header-right" />
      </div>
    </header>

    <div class="like-form__content">

      <slot />

    </div>

  </div>
</template>

<script>
import LikeCoinIcon from '../assets/logo/color-icon-label.svg';

export default {
  name: 'like-form',
  data() {
    return {
      LikeCoinIcon,
    };
  },
};
</script>

<style lang="scss">
$header-icon-width: 128px;
$header-icon-height: 166px;
$header-height: 48px;

.like-form {
  width: 100%;
  padding-top: ($header-icon-height - $header-height) / 2 + 16px;

  &__header {
    position: relative;

    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;

    height: $header-height;
    padding: 0 24px;

    background: linear-gradient(255deg, #d2f0f0, #f0e6b4);

    font-size: 14px;

    @media (max-width: 600px) {
      font-size: 12px;
    }

    &__icon {
      position: absolute;
      top: calc(45% - #{$header-icon-height} / 2);
      left: calc(50% - #{$header-icon-width} / 2);

      width: $header-icon-width;
      height: $header-icon-height;
    }
  }

  &__content {
    background-color: #f7f7f7;
    @media (min-width: 600px + 1px) {
      padding: 80px 48px 38px;
    }
    @media (max-width: 600px) {
      padding: 80px 16px 24px;
    }
  }
}
</style>
