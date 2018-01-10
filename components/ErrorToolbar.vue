<template>
    <md-toolbar class="md-layout" v-if="message" ><md-icon> {{ icon }} </md-icon><div class="md-layout-item" v-html="message" /></md-toolbar>
</template>

<script>
  export default {
    name: 'ErrorToolbar',
    props: ['message', 'icon'],
  };
</script>
