<template>
  <div class="bonus-page">

    <nuxt-child />

  </div>
</template>


<script>
import { mapGetters } from 'vuex';

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
          content: this.$t('BonusPage.label.description'),
        },
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('BonusPage.title'),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('BonusPage.label.description'),
        },
        {
          hid: 'og_image',
          property: 'og:image',
          content: 'https://like.co/images/og/tokensale.jpg',
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsFetching',
      'getUserIsRegistered',
    ]),
  },
  watch: {
    getUserIsFetching(f) {
      if (!f) {
        if (!this.getUserIsRegistered) {
          this.$router.push({ name: 'in-register', query: this.$route.query });
        }
      }
    },
  },
  mounted() {
    if (!this.getUserIsFetching) {
      if (!this.getUserIsRegistered) {
        this.$router.push({ name: 'in-register', query: this.$route.query });
      }
    }
  },
};
</script>
