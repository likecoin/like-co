<template>
  <section class="lc-container-0" id="early-supporters">
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
                  {{ $t('Home.EarlySupporters.title') }}
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
              <avatar-grid :items="supporters" />
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>


<script>
import AvatarGrid from '../AvatarGrid';

const SUPPORTERS = [
  {
    key: '6-club',
    avatar: '/images/supporters/6-club.svg',
  },
  {
    key: 'u-domain',
    avatar: '/images/supporters/u-domain.jpg',
  },
  {
    key: 'annie-zhang',
    avatar: '/images/supporters/annie-zhang.png',
  },
  {
    key: 'greg-song',
    avatar: '/images/supporters/greg-song.png',
    platforms: [
      {
        key: 'linkedin',
        to: 'https://www.linkedin.com/in/gregsung/',
      },
    ],
  },
  {
    key: 'harry-xiao',
    avatar: '/images/supporters/harry-xiao.png',
    platforms: [
      {
        key: 'linkedin',
        to: 'https://www.linkedin.com/in/yong-quan-xiao-3419061a/',
      },
    ],
  },
  {
    key: 'heartherm-huang',
    avatar: '/images/supporters/heartherm-huang.png',
    platforms: [
      {
        key: 'linkedin',
        to: 'https://www.linkedin.com/in/heathermhuang/',
      },
    ],
  },
  {
    key: 'jacky-chu',
    avatar: '/images/supporters/jacky-chu.png',
  },
];

export default {
  name: 'early-supporters',
  components: {
    AvatarGrid,
  },
  computed: {
    supporters() {
      return SUPPORTERS.map(this.translateSupporter);
    },
  },
  methods: {
    translateSupporter({ key, ...userInfo }) {
      return {
        title: this.$t(`Home.EarlySupporters.supporter.${key}.title`),
        subtitle: this.$t(`Home.EarlySupporters.supporter.${key}.subtitle`),
        ...userInfo,
      };
    },
  },
};
</script>
