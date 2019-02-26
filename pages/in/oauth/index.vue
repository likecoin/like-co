<template>
  <div>
    <oauth-permission-dialog
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
  layout: 'blank',
  components: {
    OauthPermissionDialog,
  },
  data() {
    return {
      shouldPromptPermissionDialog: true,
    };
  },
  async asyncData({ error, query }) {
    const {
      client_id: clientId,
      redirect_uri: redirectUri,
      state,
    } = query;
    let { scope = 'profile' } = query;
    if (scope) scope = scope.split(' ');
    if (!scope.includes('profile')) scope.push('profile');
    try {
      // TODO: Check scope
      const res = await apiGetOAuthAuthorize(clientId, redirectUri);
      const { provider } = res.data;
      return {
        clientId,
        redirectUri,
        state,
        provider,
        scope,
      };
    } catch (err) {
      return error((err.response || {}).data || err.message);
    }
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
      url.query.auth_code = authCode;
      if (state) url.query.state = state;
      url.set('query', url.query);
      window.location.href = url.toString();
    },
  },
};
</script>
