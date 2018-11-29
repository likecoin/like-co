<template>
  <button
    :class="[
      'l-button',
      {
        'l-button--disabled': isDisabled,
      }
    ]"
    @click="$emit('click', $event)"
  >
    <span
      v-if="$slots.icon"
      class="l-button__icon"
    >
      <slot name="icon" />
    </span>
    <span class="l-button__title">
      {{ title }}
    </span>
  </button>
</template>

<script>
export default {
  name: 'l-button',
  props: {
    title: {
      type: String,
      default: '',
    },
    isDisabled: {
      type: [Boolean, String],
      default: false,
    },
  },
};
</script>

<style lang="scss">
@import "~assets/variables";

.l-button {
  position: relative;

  display: flex;
  align-items: center;

  box-sizing: border-box;

  min-width: 256px;

  cursor: pointer;
  user-select: none;

  color: white;
  border: none;
  border-radius: 8px;
  background-color: $like-green;

  &::before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    content: '';

    transition: opacity 0.25s ease;
    pointer-events: none;

    opacity: 0;
    border-radius: inherit;
    background-color: rgba(0, 0, 0, 0.5);
  }

  &:hover {
    &::before {
      opacity: 0.25;
    }
  }

  &:active {
    &::before {
      opacity: 0.75;
    }
  }

  &--disabled {
    pointer-events: none !important;

    color: $gray-c0 !important;
    background-color: $gray-e6 !important;
  }

  &__icon {
    box-sizing: content-box;
    width: 28px;
    height: 28px;
    padding-left: 16px;
  }

  &__icon + &__title {
    padding-right: 32px;
    padding-left: 8px;
  }

  &__title {
    flex: 1;

    padding: 6px 16px;

    text-align: center;

    font-size: 24px;
    line-height: 1.33;
  }
}
</style>
