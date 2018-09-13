<template>
  <div class="selectable-field">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'selectable-field',
};
</script>

<style lang="scss" scoped>
@import '~assets/variables';

.selectable-field {
  min-height: 44px;
  padding: 12px 8px;

  user-select: all;
  text-align: center;
  word-break: break-all;

  color: $like-dark-brown-2;
  background-color: $gray-e6;

  font-family: menlo, 'Courier New', Courier, monospace;
  font-size: 16px;
}
</style>
