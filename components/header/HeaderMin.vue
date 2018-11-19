<template>
  <div id="site-header">

    <div class="navigation-menu">

      <site-title />

    </div>
  </div>
</template>


<script>
import SiteTitle from '~/components/SiteTitle';

export default {
  name: 'site-header-min',
  components: {
    SiteTitle,
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

#site-header {
  .navigation-menu {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 40px 8px;

    @media (max-width: 768px) {
      padding: 12px;
    }
  }
}
</style>
