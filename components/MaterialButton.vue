<template>
  <md-button
    :class="[className, hasShadow ? 'shadow' : '']"
    @click="handleClick"
    :type="type"
    :form="form">
    <slot />
  </md-button>
</template>

<script>
  export default {
    name: 'material-button',
    props: ['className', 'hasShadow', 'type', 'form'],
    methods: {
      handleClick() {
        this.$emit('click');
      },
    },
  };
</script>

<style lang="scss" scoped>
@import "~assets/index";

.md-button {
  width: 100%;
  height: auto;

  border-radius: 0;

  color: $like-white;
  background-color: $like-green;

  font-size: 24px;
  line-height: 32px;

  &.shadow {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  }

  :global(.md-ripple) {
    padding: 8px;

    :global(.md-button-content) > a {
      color: $like-white;
      text-decoration: none;
    }
  }
}
</style>
