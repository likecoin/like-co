<template>
  <div>
    <nuxt/>
    <my-footer/>
  </div>
</template>

<script>
import MyFooter from '~/components/footer/Footer';

export default {
  components: {
    MyFooter,
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";
@import "~assets/default";
</style>
