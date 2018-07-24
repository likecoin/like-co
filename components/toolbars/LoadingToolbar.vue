<template>
  <md-progress-bar
    v-if="isLoading"
    :class="isInTransaction ? '' : 'md-accent'"
    md-mode="indeterminate"
  />
</template>

<script>
export default {
  name: 'loading-toolbar',
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    isInTransaction: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
