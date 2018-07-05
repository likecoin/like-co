<template>
  <div class="policies-page">
    <section class="lc-container-0">

      <div class="lc-container-1">
        <div class="underlay lc-mobile-hide" />
        <div class="lc-container-2">
          <div class="lc-container-3 lc-padding-bottom-24">
            <h1 class="lc-font-size-20 lc-font-weight-400 lc-line-height-1_5">
              {{ $t('PoliciesPage.title' ) }}
            </h1>
          </div>
        </div>
      </div>

      <div class="lc-container-1">
        <div class="lc-container-2 lc-width-2-3">
          <div class="lc-container-3 lc-padding-vertical-24">
            <policies-links />
          </div>
        </div>
      </div>

    </section>
  </div>
</template>


<script>
import PoliciesLinks from '~/components/PoliciesLinks';

export default {
  name: 'policies-page',
  components: {
    PoliciesLinks,
  },
};
</script>
