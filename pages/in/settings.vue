<template>
  <div class="settings-page">
    <section class="lc-container-0">
      
      <div class="lc-container-1">
        <div class="underlay lc-mobile-hide" />
        <div class="lc-container-2">
          <div class="lc-container-3 lc-padding-bottom-24">
            <h1 class="lc-font-size-20 lc-font-weight-400 lc-line-height-1_5">
              {{ $t('Settings.title' ) }}
            </h1>
          </div>
        </div>
      </div>

      <div class="lc-container-1 lc-margin-top-24">
        <div class="lc-container-2">
          <div class="lc-container-3 lc-padding-vertical-16 lc-bg-gray-1">
            <div class="settings-panel">
              <!-- List of Settings -->
              <ul>
                <li>
                  <md-switch
                    class="md-primary"
                    v-model="isEmailEnabled"
                    :disabled="disabled" />
                  <div class="description">
                    {{ $t('Register.form.enableEmail') }}
                  </div>
                </li>
              </ul>

              <div class="confirm-button-wrapper">
                <md-button
                  class="md-likecoin"
                  :disabled="!hasChanged || disabled"
                  @click="confirmChanges">
                  {{ $t('General.button.confirm') }}
                </md-button>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div class="lc-container-1">
        <div class="lc-container-2 lc-width-2-3">

          <div class="lc-container-3 lc-padding-vertical-40">
            <policies-links />
          </div>

          <div class="lc-container-3">
            <i18n tag="p" path="Settings.label.contactUs" class="contact-us">
              <a place="deleteAccount" @click="deleteAccount">
                {{ $t('Settings.button.deleteAccount') }}</a>
              <a place="requestReport" @click="requestReport">
                {{ $t('Settings.button.requestReport') }}</a>
            </i18n>
          </div>

        </div>
      </div>

    </section>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import { logTrackerEvent } from '@/util/EventLogger';
import User from '@/util/User';

import PoliciesLinks from '~/components/PoliciesLinks';

export default {
  name: 'settings-page',
  components: {
    PoliciesLinks,
  },
  data() {
    return {
      isEmailEnabled: false,
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserIsReady',
      'getUserIsRegistered',
      'getUserNeedAuth',
      'getUserNeedRegister',
    ]),
    disabled() {
      return this.isLoading || !(this.getUserIsReady && this.getUserIsRegistered);
    },
    hasChanged() {
      const user = this.getUserInfo;
      return this.getUserIsReady && this.getUserIsRegistered && (
        this.isEmailEnabled !== user.isEmailEnabled
      );
    },
  },
  methods: {
    ...mapActions([
      'loginUser',
      'newUser',
      'refreshUserInfo',
      'setInfoMsg',
    ]),
    async triggerLoginSign() {
      if (!(await this.loginUser())) this.$router.go(-1);
    },
    async updateInfo() {
      const user = this.getUserInfo;
      this.isEmailEnabled = !!user.isEmailEnabled;
    },
    async confirmChanges() {
      this.isLoading = true;
      try {
        const user = this.getUserInfo;
        const userInfo = {
          user: user.user,
          wallet: user.wallet,
          isEmailEnabled: this.isEmailEnabled,
        };
        const data = await User.formatAndSignUserInfo(userInfo, this.$t('Sign.Message.editUser'));
        await this.newUser(data);
        this.setInfoMsg(`${this.$t('Register.form.label.updatedInfo')}  <a href="/${this.user}">${this.$t('Register.form.label.viewPage')}</a>`);
        this.refreshUserInfo(user.user);
      } catch (err) {
        console.error(err);
      }
      this.isLoading = false;
    },
    deleteAccount() {
      logTrackerEvent(this, 'Settings', 'deleteAccount', 'User wants to delete account', 1);
    },
    requestReport() {
      logTrackerEvent(this, 'Settings', 'requestReport', 'User wants to fire a report request', 1);
    },
  },
  watch: {
    getUserNeedRegister(value) {
      if (value) {
        this.$router.push({ name: 'in-register', query: { ref: 'in-settings', ...this.$route.query } });
      }
    },
    getUserNeedAuth(value) {
      if (value) {
        this.triggerLoginSign();
      }
    },
    getUserIsReady(value) {
      if (value && this.getUserIsRegistered) {
        this.updateInfo();
      }
    },
  },
  mounted() {
    if (this.getUserNeedRegister) {
      this.$router.push({ name: 'in-register', query: { ref: 'in-settings', ...this.$route.query } });
    } else if (this.getUserNeedAuth) {
      this.triggerLoginSign();
    } else if (this.getUserIsReady && this.getUserIsRegistered) {
      this.updateInfo();
    }
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.contact-us {
  color: $like-gray-4;

  font-size: 12px;
  line-height: 1.8;

  a {
    text-decoration: underline;

    color: $like-dark-brown-1;

    &:hover {
      color: darken($like-dark-brown-1, 20%);
    }
  }
}

.settings-panel {
  @media (min-width: 768px + 1px) {
    display: flex;
  }

  ul {
    @media (min-width: 768px + 1px) {
      flex: 2;
    }

    li {
      display: flex;

      .description {
        margin: 16px 16px 16px 0;
      }
    }
  }

  .confirm-button-wrapper {
    display: flex;
    align-items: flex-end;
    flex-shrink: 0;
    justify-content: flex-end;

    @media (min-width: 768px + 1px) {
      flex: 1;
    }

    @media (max-width: 768px) {
      justify-content: center;

      margin-top: 16px;
    }
  }
}
</style>
