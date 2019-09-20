<template>
  <div>
    <oauth-permission-dialog
      v-if="needAuth"
      :provider="provider"
      :scope="scope"
      :is-show.sync="shouldPromptPermissionDialog"
      @decline="onDecline"
      @accept="authorize"
    />
  </div>
</template>

<script>
import OauthPermissionDialog from '~/components/dialogs/OAuthPermissionDialog';
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
    let scope = ['profile'];
    const { scope: inputScope } = query;
    if (inputScope) scope = inputScope.split(' ');
    if (!scope.includes('profile')) scope.push('profile');
    if (req.cookies && req.cookies.likecoin_auth) {
      opt = {
        headers: {
          Cookie: `likecoin_auth=${req.cookies.likecoin_auth}`,
          'x-real-ip': req.headers['x-real-ip'] || req.ip,
          'user-agent': req.headers['x-ucbrowser-ua'] || req.headers['user-agent'],
        },
      };
    }
    try {
      const res = await apiGetOAuthAuthorize(clientId, redirectUri, scope, opt);
      const { provider, isAuthed = false, isTrusted = false } = res.data;
      if (!inputScope && provider.defaultScopes) scope = provider.defaultScopes;
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
    needAuth() {
      return !(this.isAuthed || this.isTrusted);
    },
  },
  mounted() {
    if (!this.needAuth) this.authorize();
  },
  methods: {
    onDecline() {
      const url = new URL(this.redirectUri, true);
      url.query.error = 'denied';
      if (this.state) url.query.state = this.state;
      url.set('query', url.query);
      window.location.href = url.toString();
    },
    async authorize() {
      const payload = {
        clientId: this.clientId,
        redirectUri: this.redirectUri,
        state: this.state,
        scope: this.scope,
      };
      const result = await apiPostOAuthAuthorize(payload);
      const {
        redirectUri,
        state,
        authCode,
      } = result.data;
      const url = new URL(redirectUri, true);
      url.query.code = authCode;
      if (state) url.query.state = state;
      url.set('query', url.query);
      window.location.href = url.toString();
    },
  },
};
</script>
