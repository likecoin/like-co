<template>
    <md-progress-bar v-if="isLoading" :class="isInTransaction?'':'md-accent'" md-mode="indeterminate"></md-progress-bar>
</template>

<script>
  export default {
    name: 'LoadingToolbar',
    props: ['isLoading', 'isInTransaction'],
  };
</script>
