<template>
  <section
    id="advisors"
    class="lc-container-0"
  >
    <div class="lc-container-1">

      <!-- Section Title -->
      <div class="lc-container-header">
        <div class="lc-container-2 lc-container-header-overlay">
          <div class="lc-container-3 lc-bg-gray-1 lc-mobile-hide" />
        </div>
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4">
              <div class="lc-container-header-title">
                <h1 class="lc-font-size-32 lc-mobile">
                  {{ $t('Home.Advisors.title') }}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lc-container-2">
        <div class="lc-container-3 lc-bg-gray-1">
          <div class="lc-container-4">
            <div class="lc-padding-top-24 lc-padding-bottom-32">
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
    platforms: [
      {
        key: 'linkedin',
        to: 'https://hk.linkedin.com/in/avengermojo',
      },
    ],
  },
  {
    key: 'haggen-so',
    avatar: '/images/advisors/haggen-so.jpg',
    platforms: [
      {
        key: 'linkedin',
        to: 'https://www.linkedin.com/in/haggenso/',
      },
    ],
  },
  {
    key: 'jon-phillips',
    avatar: '/images/advisors/jon-phillips.jpg',
    platforms: [
      {
        key: 'linkedin',
        to: 'https://www.linkedin.com/comm/in/jon-phillips-99416189',
      },
    ],
  },
  {
    key: 'isaac-mao',
    avatar: '/images/advisors/isaac-mao.jpg',
    platforms: [
      {
        key: 'linkedin',
        to: 'https://www.linkedin.com/in/isaacmao/',
      },
    ],
  },
  {
    key: 'to-cheung',
    avatar: '/images/supporters/to-cheung.jpg',
    platforms: [
      {
        key: 'linkedin',
        to: 'https://www.linkedin.com/in/cheungto/',
      },
    ],
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
    translateAdvisor({ key, ...userInfo }) {
      return {
        title: this.$t(`Home.Advisors.advisor.${key}.title`),
        description: this.$t(`Home.Advisors.advisor.${key}.description`),
        ...userInfo,
      };
    },
  },
};
</script>
