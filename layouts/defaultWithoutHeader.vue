<template>
  <div class="lc-page-wrapper">
    <div class="lc-page-content">
      <nuxt/>
    </div>

    <footer class="lc-page-footer">
      <div class="lc-container-0">
        <my-footer/>
      </div>
    </footer>

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

.lc-page-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  height: 100%;

  .lc-page-content {
    flex: 1;
  }

  .lc-page-footer {
    padding: 0;
  }
}
</style>
