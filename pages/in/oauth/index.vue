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
    <div v-else class="lc-padding-vertical-64">
      <spinner :size="56" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import OauthPermissionDialog from '~/components/dialogs/OAuthPermissionDialog';
import Spinner from '@/components/Spinner';
import { timeout } from '@/util/misc';
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
    let { scope = 'profile' } = query;
    if (scope) scope = scope.split(' ');
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
    shouldStartIntercom() {
      const { intercom } = this.$route.query;
      return intercom && intercom !== '0';
    },
    needAuth() {
      return !(this.isAuthed || this.isTrusted);
    },
  },
  async mounted() {
    if (this.shouldStartIntercom) {
      if (this.$intercom) {
        /* TODO: refactor this into util function */
        const {
          user,
          intercomToken,
          displayName,
          email,
        } = this.getUserInfo;
        const opt = { LikeCoin: true };
        const language = this.getCurrentLocale;
        if (user) opt.user_id = user;
        if (intercomToken) opt.user_hash = intercomToken;
        if (displayName) opt.name = displayName;
        if (email) opt.email = email;
        if (language) opt.language = language;
        this.$intercom.boot(opt);
        let count = 0;
        while (!this.$intercom.ready && count <= 10) {
          count += 1;
          await timeout(200); // eslint-disable-line no-await-in-loop
        }
      }
    }
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
