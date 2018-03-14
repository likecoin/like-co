<template>
  <md-button @click="handleClick">
    <slot />
  </md-button>
</template>

<script>
  export default {
    name: 'material-button',
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
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  background-color: $like-green;

  font-size: 24px;
  line-height: 32px;

  :global(.md-ripple) {
    padding: 8px;

    :global(.md-button-content) > a {
      color: $like-white;
      text-decoration: none;
    }
  }
}
</style>
