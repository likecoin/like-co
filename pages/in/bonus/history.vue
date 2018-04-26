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
                <mission-list :missions="getMissionHistorylist" :is-grid="true" />
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
import { mapActions, mapGetters } from 'vuex';
import MissionList from '@/components/Mission/List';

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
      missions: [],
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserIsFetching',
      'getUserIsRegistered',
      'getMissionHistorylist',
    ]),
  },
  methods: {
    ...mapActions([
      'refreshMissionHistoryList',
    ]),
  },
  watch: {
    getUserIsFetching(f) {
      if (!f) {
        if (this.getUserIsRegistered) {
          this.refreshMissionHistoryList(this.getUserInfo.user);
        }
      }
    },
  },
  mounted() {
    if (!this.getUserIsFetching) {
      if (this.getUserIsRegistered) {
        this.refreshMissionHistoryList(this.getUserInfo.user);
      }
    }
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.history-tab {
}
</style>
