<template>
  <div>
    <oauth-permission-dialog
      v-if="needAuth"
      :provider="provider"
      :user="getUserInfo"
      :scope="scope"
      :is-show.sync="shouldPromptPermissionDialog"
      @decline="onDecline"
      @accept="authorize"
      @changeUser="onChangeUser"
    />
    <div
      v-else
      class="lc-padding-vertical-64"
    >
      <spinner :size="56" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import OauthPermissionDialog from '~/components/dialogs/OAuthPermissionDialog';
import Spinner from '@/components/Spinner';
import {
  apiGetOAuthAuthorize,
  apiPostOAuthAuthorize,
} from '@/util/api/api';

const URL = require('url-parse');

export default {
  name: 'oauth-view',
  middleware: 'authenticated',
  layout: 'register',
  components: {
    OauthPermissionDialog,
    Spinner,
  },
  data() {
    return {
      isAuthed: false,
      shouldPromptPermissionDialog: true,
    };
  },
  async asyncData({ error, query, req }) {
    let opt;
    const {
      client_id: clientId,
      redirect_uri: redirectUri,
      state,
    } = query;
    const checkScope = [];
    const { scope: inputScope } = query;
    if (inputScope) {
      const scopes = inputScope.split(' ');
      scopes.forEach((s) => {
        if (!s.includes(':') && !['profile', 'email'].includes(s)) {
          checkScope.push(`read:${s}`);
          checkScope.push(`write:${s}`);
        } else {
          checkScope.push(s);
        }
      });
      if (!checkScope.includes('profile')) checkScope.push('profile');
    } else {
      checkScope.push('profile');
    }
    if (req && req.cookies && req.cookies.likecoin_auth) {
      opt = {
        headers: {
          Cookie: `likecoin_auth=${req.cookies.likecoin_auth}`,
          'x-real-ip': req.headers['x-real-ip'] || req.ip,
          'user-agent': req.headers['x-ucbrowser-ua'] || req.headers['user-agent'],
        },
      };
    }
    try {
      const res = await apiGetOAuthAuthorize(clientId, redirectUri, checkScope, opt);
      const { provider, isAuthed = false, isTrusted = false } = res.data;
      let scope;
      if (!inputScope && provider.defaultScopes) {
        scope = provider.defaultScopes;
      } else {
        scope = checkScope;
      }
      return {
        clientId,
        redirectUri,
        state,
        provider,
        scope,
        isAuthed,
        isTrusted,
      };
    } catch (err) {
      return error((err.response || {}).data || err.message);
    }
  },
  computed: {
    ...mapGetters([
      'getCurrentLocale',
      'getUserInfo',
    ]),
    needAuth() {
      return !(this.isAuthed || this.isTrusted);
    },
  },
  async mounted() {
    if (!this.needAuth) this.authorize();
  },
  methods: {
    ...mapActions([
      'logoutUser',
      'doUserAuth',
    ]),
    onDecline() {
      const url = new URL(this.redirectUri, true);
      url.query.error = 'denied';
      if (this.state) url.query.state = this.state;
      url.set('query', url.query);
      window.location.href = url.toString();
    },
    async onChangeUser() {
      await this.logoutUser();
      await this.doUserAuth({ router: this.$router, route: this.$route });
    },
    async authorize() {
      const payload = {
        clientId: this.clientId,
        redirectUri: this.redirectUri,
        state: this.state,
        scope: this.scope,
      };
      let error;
      let authCode;
      let state;
      try {
        const result = await apiPostOAuthAuthorize(payload);
        ({
          state,
          authCode,
        } = result.data);
      } catch (err) {
        console.error(err);
        error = (err.response || {}).data || err.message;
      }
      const url = new URL(this.redirectUri, true);
      if (authCode) url.query.code = authCode;
      if (error) url.query.error = error;
      if (state) url.query.state = state;
      url.set('query', url.query);
      window.location.href = url.toString();
    },
  },
};
</script>
