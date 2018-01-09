<template>
    <md-toolbar class="md-layout" v-if="message" ><md-progress-spinner md-mode="indeterminate" class="md-warn" /><md-icon class="md-warn">warning</md-icon><div class="md-layout-item" v-html="message" /></md-toolbar>
</template>

<script>
  export default {
    name: 'ErrorToolbar',
    props: ['message'],
  };
</script>
