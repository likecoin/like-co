<template>
  <div class="bonus-page">

    <div class="lc-container-0">
      <div class="lc-container-1 lc-padding-top-40-mobile">
        <div class="underlay gray" />
        <div class="lc-container-2">

          <div class="lc-container-3">
            <div class="lc-container-4">
              <div class="lc-padding-bottom-8">
                <h1 class="lc-font-size-32 lc-text-align-center-mobile">{{ $t('BonusPage.title') }}</h1>
              </div>
            </div>
          </div>

          <like-coin-amount
            class="likecoin-amount-section lc-padding-bottom-0-mobile lc-margin-top-32"
            :amountText="$t('BonusPage.label.earned')"
            :value="likeCoinAmountStr" />

          <div class="lc-container-3">
            <div class="lc-container-4">
              <div class="lc-margin-top-24">
                <md-tabs class="lc-tabs lc-width-2-3 md-transparent" md-sync-route>

                  <template slot="md-tab"  slot-scope="{ tab }">
                    <span class="lc-tab-item-label">{{ tab.label }}</span>
                  </template>

                  <md-tab
                    id="bonus-tab"
                    :md-label="$t('BonusPage.tab.bonus')"
                    to="/in/bonus" />
                  <md-tab
                    id="history-tab"
                    :md-label="$t('BonusPage.tab.history')"
                    to="/in/bonus/history" />

                </md-tabs>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <nuxt-child />

    <mission-dialog />

  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import MissionDialog from '@/components/dialogs/MissionDialog';
import LikeCoinAmount from '@/components/LikeCoinAmount';

export default {
  name: 'bonus-page',
  layout: 'defaultWithGrayHeader',
  head() {
    return {
      title: this.$t('BonusPage.title'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('BonusPage.description'),
        },
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('BonusPage.title'),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('BonusPage.description'),
        },
      ],
    };
  },
  data() {
    return {
      likeCoinAmountStr: '',
    };
  },
  components: {
    LikeCoinAmount,
    MissionDialog,
  },
  computed: {
    ...mapGetters([
      'getUserIsFetching',
      'getUserIsRegistered',
      'getUserInfo',
    ]),
  },
  methods: {
    ...mapActions([
      'refreshMissionList',
      'fetchUserTotalBonus',
    ]),
    async updateInfo() {
      this.updateLikeCoin();
      this.updateMission();
    },
    async updateLikeCoin() {
      try {
        this.likeCoinAmountStr = await this.fetchUserTotalBonus(this.getUserInfo.user);
      } catch (err) {
        console.log(err);
      }
    },
    async updateMission() {
      this.refreshMissionList(this.getUserInfo.user);
    },
  },
  watch: {
    getUserIsFetching(f) {
      if (!f) {
        if (!this.getUserIsRegistered) {
          this.$router.push({ name: 'in-register' });
        } else {
          this.updateInfo();
        }
      }
    },
  },
  mounted() {
    const { hash } = document.location;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) element.scrollIntoView();
    }
    if (!this.getUserIsFetching) {
      if (!this.getUserIsRegistered) {
        this.$router.push({ name: 'in-register' });
      } else {
        this.updateInfo();
      }
    }
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.likecoin-amount-section {
  width: calc(2 / 3 * 100% + 72px);

  :global(#likecoin-amount) {
    background-color: $like-light-blue;
    background-image: none;
  }
}

.lc-tabs {
  color: $like-gray-4;

  :global(.md-button) {
    flex-grow: 1;

    max-width: none;
  }

  :global(.md-tabs-indicator) {
    height: 3px;

    background-color: transparent;

    &::before {
      position: relative;

      display: block;

      width: 24px;
      height: 3px;
      margin: auto;

      content: " ";

      background-color: $like-green;
    }
  }
}

.lc-tab-item-label {
  font-size: 14px;
  font-weight: 600;

  a:not(.md-active) & {
    color: $like-gray-4;
  }
}
</style>
