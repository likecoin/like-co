<template>
  <div class="earn-page">
    <div class="lc-container-1">
      <div class="lc-container-2">
        <div class="lc-container-3 lc-container-no-padding-mobile">
          <like-button-intro
            class="lc-margin-top-48"
            @start="onClickStart"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LikeButtonIntro from '~/components/LikeButtonIntro';

export default {
  name: 'earn-page',
  components: {
    LikeButtonIntro,
  },
  head() {
    return {
      title: this.$t('LikeButtonIntro.title.earn'),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('LikeButtonIntro.title.earn'),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('LikeButtonIntro.label.earn'),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('LikeButtonIntro.label.earn'),
        },
      ],
    };
  },
  methods: {
    onClickStart() {
      this.$router.push({ name: 'in-settings-button' });
    },
  },
  mounted() {
    const { action, ...query } = this.$route.query;
    if (action === 'start' || action === 'sign') {
      this.$nextTick(this.onClickStart);
    }
    if (action) {
      this.$router.push({ ...this.$route, query });
    }
  },
};
</script>
