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
      'getUserIsReady',
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
    getUserIsReady(a) {
      if (a) {
        if (!this.getUserIsRegistered) {
          this.$router.push({ name: 'in-register' });
        } else {
          this.updateInfo();
        }
      }
    },
  },
  mounted() {
    if (this.getUserIsReady) {
      if (!this.getUserIsRegistered) {
        this.$router.push({ name: 'in-register' });
      } else {
        this.updateInfo();
      }
    }
  },
};
</script>
