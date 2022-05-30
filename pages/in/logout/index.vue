<template>
  <div class="lc-padding-vertical-64">
    <spinner :size="56" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Spinner from '@/components/Spinner';

export default {
  name: 'auth-api-view',
  layout: 'register',
  components: {
    Spinner,
  },
  data() {
    return {
      isPopup: this.$route.query.is_popup === '1',
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
    ]),
  },
  async mounted() {
    if (this.getUserIsRegistered) {
      await this.logout();
    } else {
      this.postLogout();
    }
  },
  methods: {
    ...mapActions([
      'logoutUser',
    ]),
    async logout() {
      await this.logoutUser();
      this.postLogout();
    },
    postLogout() {
      if (this.isPopup) {
        try {
          window.close();
          this.$router.push('/');
        } catch (err) {
          console.error(err);
          this.$router.push('/');
        }
      } else {
        this.$router.push('/');
      }
    },
  },
};
</script>
