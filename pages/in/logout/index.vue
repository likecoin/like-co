<template>
  <div class="lc-padding-vertical-64">
    <spinner :size="56" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Spinner from '@/components/Spinner';

import { POST_LOGOUT_ROUTE } from '@/constant';

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
          this.$router.push(POST_LOGOUT_ROUTE);
        } catch (err) {
          console.error(err);
          this.$router.push(POST_LOGOUT_ROUTE);
        }
      } else {
        this.$router.push(POST_LOGOUT_ROUTE);
      }
    },
  },
};
</script>
