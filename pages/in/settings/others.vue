<template>
  <div class="settings-page">
    <section class="lc-container-0">
      <div class="lc-container-1 lc-margin-top-40">
        <div class="lc-container-2">
          <div class="lc-container-3 lc-padding-vertical-16 lc-bg-gray-1">
            <div class="settings-panel">
              <!-- List of Settings -->
              <ul>
                <li>
                  <md-switch
                    v-model="isEmailEnabled"
                    :disabled="disabled"
                    class="md-primary"
                  />
                  <div class="description">
                    {{ $t('Register.form.enableEmail') }}
                  </div>
                </li>
              </ul>

              <div class="confirm-button-wrapper">
                <md-button
                  :disabled="!hasChanged || disabled"
                  class="md-likecoin"
                  @click="confirmChanges"
                >
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
            <i18n
              tag="p"
              path="Settings.label.contactUs"
              class="contact-us"
            >
              <a
                place="deleteAccount"
                @click="deleteAccount"
              >
                {{ $t('Settings.button.deleteAccount') }}</a>
              <a
                place="requestReport"
                @click="requestReport"
              >
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
  name: 'settings-others',
  components: {
    PoliciesLinks,
  },
  data() {
    return {
      isEmailEnabled: false,
      isEmailPreviouslyEnabled: false,
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
  watch: {
    getUserNeedRegister(value) {
      if (value) {
        this.$router.push({ name: 'in-register', query: { ref: 'in-settings-others', ...this.$route.query } });
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
      this.isEmailEnabled = (user.isEmailEnabled !== false);
      this.isEmailPreviouslyEnabled = this.isEmailEnabled;
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
        this.isEmailEnabled = this.isEmailPreviouslyEnabled;
      }
      this.isLoading = false;
    },
    deleteAccount() {
      logTrackerEvent(this, 'Settings', 'deleteAccount', 'User wants to delete account', 1);
      if (this.$intercom) this.$intercom.showNewMessage(this.$t('Settings.label.deleteAccountPrePopulatedMessage'));
    },
    requestReport() {
      logTrackerEvent(this, 'Settings', 'requestReport', 'User wants to fire a report request', 1);
      if (this.$intercom) this.$intercom.showNewMessage(this.$t('Settings.label.requestReportPrePopulatedMessage'));
    },
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
