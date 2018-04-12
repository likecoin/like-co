<template>
  <div class="history-tab">

    <!-- BEGIN - Completed Bonus Section -->
    <section class="lc-margin-top-48 lc-mobile">
      <div class="lc-container-0">
        <div class="lc-container-1">
          <div class="lc-container-header">
            <div class="lc-container-2 lc-container-header-overlay">
              <div class="lc-container-3 lc-bg-gray-1" />
            </div>
            <div class="lc-container-2">
              <div class="lc-container-3">
                <div class="lc-container-4">
                  <div class="lc-container-header-title">
                    <h1 class="lc-font-size-32 lc-mobile">
                      {{ $t('BonusPage.HistoryTab.header.completedBonus') }}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="lc-container-2">
            <div class="lc-container-3 lc-bg-gray-1 lc-padding-vertical-32 section-content">
              <div class="lc-container-4">
                <mission-list :missions="missions" :is-grid="true" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
    <!-- END - Completed Bonus Section -->

  </div>
</template>


<script>
import MissionList from '@/components/Mission/List';

const COMPLETED_MISSIONS = [
  {
    id: '1',
    title: 'Getting Start',
    reward: '3 LIKE',
    state: 'claimed',
  },
  {
    id: '2',
    title: 'Invite Friends',
    reward: '8 LIKE <span class="small">(each)</span>',
    state: 'claimed',
  },
  {
    id: '3',
    title: 'Join Token Sale',
    reward: '100 LIKE',
    state: 'claimed',
  },
  {
    id: '4',
    title: 'Invite Friends to Join Token Sale',
    reward: '2.5% <span class="small">bonus</span>',
    state: 'claimed',
  },
  {
    id: '5',
    title: 'Getting Start',
    reward: '3 LIKE',
    state: 'claimed',
  },
  {
    id: '6',
    title: 'Invite Friends',
    reward: '8 LIKE <span class="small">(each)</span>',
    state: 'claimed',
  },
  {
    id: '7',
    title: 'Join Token Sale',
    reward: '100 LIKE',
    state: 'claimed',
  },
  {
    id: '8',
    title: 'Invite Friends to Join Token Sale',
    reward: '2.5% <span class="small">bonus</span>',
    state: 'claimed',
  },
];

export default {
  name: 'history-tab',
  head() {
    return {
      title: this.$t('BonusPage.HistoryTab.title'),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('BonusPage.HistoryTab.title'),
        },
      ],
    };
  },
  components: {
    MissionList,
  },
  data() {
    return {
      missions: COMPLETED_MISSIONS,
    };
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.history-tab {
}
</style>
