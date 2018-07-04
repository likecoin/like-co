<template>
  <md-button
    :class="[className, classObject]"
    @click="handleClick"
    :type="type"
    :form="form">
    <slot />
  </md-button>
</template>

<script>
export default {
  name: 'material-button',
  props: ['className', 'hasShadow', 'type', 'form', 'disabled'],
  computed: {
    classObject() {
      return {
        shadow: this.hasShadow,
        disabled: this.disabled,
      };
    },
  },
  methods: {
    handleClick() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.md-button {
  width: 100%;
  height: auto;

  white-space: normal;

  color: $like-white;

  border-radius: 0;
  background-color: $like-green;

  font-size: 24px;
  line-height: 1.35;

  @media (max-width: 600px) {
    font-size: 20px;
  }

  &.shadow {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  }

  &.disabled {
    opacity: 1 !important;
    color: $like-gray-4 !important;
    background-color: $like-gray-3 !important;
    background-image: none !important;
  }

  :global(.md-ripple) {
    padding: 4px 12px;

    :global(.md-button-content) {
      position: initial;

      > a {
        text-decoration: none;

        color: $like-white;
      }
    }
  }
}
</style>
