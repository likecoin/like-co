<template>
  <section class="lc-container-1" id="advisors">
    <div class="lc-container-2">
      <div class="block-section">

        <!-- Section title -->
        <div class="lc-container-3">
          <div class="lc-container-4">
            <div class="section-title">
              {{ $t('Home.Advisors.title') }}
            </div>
          </div>
        </div>

        <div class="lc-container-3">
          <div class="lc-container-4">
            <div class="section-content">
              <avatar-grid :items="advisors" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>


<script>
import AvatarGrid from '../AvatarGrid';

const ADVISORS = [
  {
    key: 'alex-lau',
    avatar: '/images/advisors/alex-lau.png',
  },
  {
    key: 'haggen-so',
    avatar: '/images/advisors/haggen-so.jpg',
  },
  {
    key: 'jon-phillips',
    avatar: '/images/advisors/jon-phillips.jpg',
  },
  {
    key: 'isaac-mao',
    avatar: '/images/advisors/isaac-mao.jpg',
  },
];

export default {
  name: 'advisors',
  components: {
    AvatarGrid,
  },
  computed: {
    advisors() {
      return ADVISORS.map(this.translateAdvisor);
    },
  },
  methods: {
    translateAdvisor({ key, avatar }) {
      return {
        title: this.$t(`Home.Advisors.advisor.${key}.title`),
        description: this.$t(`Home.Advisors.advisor.${key}.description`),
        avatar,
      };
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/index";

#advisors {
  @media (min-width: 601px) {
    padding-top: 36px;
  }
}
</style>
