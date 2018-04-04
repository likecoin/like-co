<template>
  <div
    :class="[
      'lc-page-wrapper',
      'with-sliding-menu',
      {
        'slide-menu-open': getIsSlidingMenuOpen,
      },
    ]">

    <div class="slide-menu-wrapper">
      <sliding-menu />
    </div>

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
import { mapGetters } from 'vuex';

import MyFooter from '~/components/footer/Footer';
import SlidingMenu from '~/components/SlidingMenu/index';

export default {
  components: {
    MyFooter,
    SlidingMenu,
  },
  computed: {
    ...mapGetters([
      'getIsSlidingMenuOpen',
    ]),
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.lc-page-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  min-height: 100%;

  .lc-page-content {
    flex: 1;
  }

  .lc-page-footer {
    padding: 0;
  }
}
</style>
