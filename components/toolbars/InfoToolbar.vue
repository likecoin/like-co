<template>
  <md-toolbar class="md-layout" md-elevation="0">
    <md-icon v-if="isError">error</md-icon>
    <md-icon v-else>check</md-icon>

    <span v-if="isError">
      {{ $t('General.label.error') }}:&nbsp;
    </span>
    <div class="md-layout-item">
      <slot />
    </div>

    <md-button
      class="md-icon-button"
      @click="$emit('onClose')">
      <md-icon>close</md-icon>
    </md-button>
  </md-toolbar>
</template>

<script>
  export default {
    name: 'InfoToolbar',
    props: ['message', 'isError'],
  };
</script>

<style lang="scss" scoped>
@import "~assets/index";

.md-toolbar {
  position: fixed;

  background-image: linear-gradient(263deg, $like-light-blue, $like-gradient-1);

  > .md-icon {
    margin-right: 12px;
  }
}
</style>
