<template>
  <div class="lc-page-wrapper">

    <div class="lc-page-content">
      <header class="lc-container-1">
        <div class="underlay gray md-xsmall-hide" />
        <div class="lc-container-2">
          <site-header/>
        </div>
      </header>

      <nuxt/>
    </div>

    <my-footer/>

  </div>
</template>


<script>
import SiteHeader from '~/components/header/Header';
import MyFooter from '~/components/footer/Footer';

export default {
  components: {
    SiteHeader,
    MyFooter,
  },
};
</script>


<style lang="scss" scoped>
@import "../assets/index";
@import "../assets/default";

.lc-page-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  height: 100%;
}

.lc-container-2 #site-header {
  padding-right: 0;
  padding-left: 0;
}
</style>
