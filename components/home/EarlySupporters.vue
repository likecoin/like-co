<template>
  <section class="lc-container-1" id="early-supporters">
    <div class="lc-container-2">
      <div class="block-section">

        <!-- Section title -->
        <div class="lc-container-3">
          <div class="lc-container-4">
            <div class="section-title">
              {{ $t('Home.EarlySupporters.title') }}
            </div>
          </div>
        </div>

        <div class="lc-container-3">
          <div class="lc-container-4">
            <div class="section-content">
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
    key: 'annie-zhang',
    avatar: '/images/supporters/annie-zhang.png',
  },
  {
    key: 'greg-song',
    avatar: '/images/supporters/greg-song.png',
  },
  {
    key: 'harry-xiao',
    avatar: '/images/supporters/harry-xiao.png',
  },
  {
    key: 'heartherm-huang',
    avatar: '/images/supporters/heartherm-huang.png',
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
    translateSupporter({ key, avatar }) {
      return {
        title: this.$t(`Home.EarlySupporters.supporter.${key}.title`),
        subtitle: this.$t(`Home.EarlySupporters.supporter.${key}.subtitle`),
        avatar,
      };
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

#early-supporters {
  @media (min-width: 601px) {
    padding-top: 36px;
  }
}
</style>
