<template>
  <footer>
    Visit our website for more information: <a href="https://likecoin.foundation/" target="_blank">likecoin.foundation</a>
  </footer>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'getUserInfo',
    ]),
  },
  mounted() {
    if (this.$intercom) {
      const { user, displayName, email } = this.getUserInfo;
      const opt = {};
      if (user) opt.user_id = user;
      if (displayName) opt.name = displayName;
      if (email) opt.email = email;
      this.$intercom.boot(opt);
    }
  },
  watch: {
    getUserInfo(e) {
      if (this.$intercom) {
        const { user, displayName, email } = e;
        const opt = {};
        if (user) opt.user_id = user;
        if (displayName) opt.name = displayName;
        if (email) opt.email = email;
        this.$intercom.update(opt);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/index";

footer {
  position: fixed;
  z-index: 4;
  bottom: 0;

  width: 100%;
  padding: 12px;

  background-color: $like-white;
}
</style>
