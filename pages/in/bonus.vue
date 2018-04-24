<template>
  <div class="bonus-page">

    <nuxt-child />

  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'bonus-page',
  layout: 'in',
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
    ]),
    async updateInfo() {
      this.updateMission();
    },
    async updateMission() {
      this.refreshMissionList(this.getUserInfo.user);
    },
  },
  watch: {
    getUserIsFetching(f) {
      if (!f) {
        if (this.getUserIsRegistered) {
          this.updateInfo();
        }
      }
    },
  },
  mounted() {
    if (!this.getUserIsFetching && this.getUserIsRegistered) {
      this.updateInfo();
    }
  },
};
</script>
