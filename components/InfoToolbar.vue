<template>
  <md-toolbar class="md-layout" v-if="message" >
    <md-icon v-if="isError">error</md-icon>
    <md-icon v-else>check</md-icon>
    <div class="md-layout-item" v-html="message" />
    <md-button class="md-icon-button" @click="$emit('onClose')"><md-icon>close</md-icon></md-button>
  </md-toolbar>
</template>

<script>
  export default {
    name: 'InfoToolbar',
    props: ['message', 'isError'],
  };
</script>

<style scoped>

.md-toolbar {
  font-size: 20px;
  background-image: linear-gradient(263deg, #d2f0f0, #f0e6b4);
  height: 40px;
}
</style>
