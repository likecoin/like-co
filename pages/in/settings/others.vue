<template>
  <div class="settings-page">
    <section class="lc-container-0 lc-margin-top-48 lc-mobile">
      <div class="lc-container-1">
        <div class="lc-container-2">
          <div class="lc-container-3 lc-padding-vertical-16 lc-bg-gray-1">
            <h2 class="lc-font-size-14 lc-font-weight-400">
              {{ $t('Settings.others.email.title') }}
            </h2>

            <div class="settings-panel">
              <!-- List of Settings -->
              <ul>
                <li>
                  <md-switch
                    v-model="isEmailEnabled"
                    :disabled="disabled"
                    class="md-likecoin"
                  />
                  <div class="description">
                    {{ $t('Settings.others.email.enableEmail') }}
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="lc-container-3 lc-bg-gray-1 lc-padding-vertical-32">
            <h2 class="lc-font-size-14 lc-font-weight-400">
              {{ $t('Settings.others.likepay.title') }}
            </h2>

            <div class="settings-panel">
              <ul>
                <li
                  v-for="(obj, i) in viewModelPaymentRedirectWhitelist"
                  :key="i"
                >
                  <md-field :class="urlClass(obj)">
                    <md-input
                      v-model="obj.url"
                      :disabled="disabled"
                      class="md-likecoin"
                      :placeholder="$t('Settings.others.likepay.addCustomUrl')"
                    />
                    <span
                      v-if="obj.err"
                      class="md-error"
                    >
                      {{ $t(`Settings.others.likepay.${obj.err}`) }}
                    </span>
                    <md-button
                      v-if="obj.url !== ''"
                      class="md-icon-button"
                      @click="deleteUrl(i)"
                    >
                      X
                    </md-button>
                  </md-field>
                </li>
              </ul>

              <div class="confirm-button-wrapper">
                <md-button
                  :disabled="disabled || !allUrlsValid"
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
            </i18n>
          </div>

        </div>
      </div>

    </section>
  </div>
</template>


<script>
/* eslint-disable no-param-reassign */
import { mapActions, mapGetters } from 'vuex';

import { logTrackerEvent } from '@/util/EventLogger';

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
      viewModelPaymentRedirectWhitelist: [{ url: '', err: '' }],
      MAX_REDIRECT_URL_NUM: 5,
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserIsRegistered',
    ]),
    disabled() {
      return this.isLoading || !this.getUserIsRegistered;
    },
    actualPaymentRedirectWhitelist() {
      return Array.from(new Set(this.viewModelPaymentRedirectWhitelist.map(obj => obj.url)
        .filter(url => !!url)));
    },
    allUrlsValid() {
      return this.viewModelPaymentRedirectWhitelist.every(obj => !obj.err);
    },
  },
  watch: {
    viewModelPaymentRedirectWhitelist: {
      handler(newValue) {
        const urlArr = newValue.map(obj => obj.url);
        newValue.forEach((obj, i) => {
          if (obj.url) {
            if (!this.isValidHttpUrl(obj.url)) {
              obj.err = 'errInvalidUrl';
            } else if (urlArr.indexOf(obj.url) !== i) {
              obj.err = 'errDuplicatedUrl';
            } else {
              obj.err = '';
            }
          } else {
            obj.err = '';
          }
        });
        const urlNum = newValue.length;
        if (urlNum === 0 || (newValue[urlNum - 1].url !== '' && urlNum < this.MAX_REDIRECT_URL_NUM)) {
          newValue.push({ url: '', err: '' });
        } else if (urlNum > 1 && newValue[urlNum - 1].url === '' && newValue[urlNum - 2].url === '') {
          newValue.pop();
        }
      },
      deep: true,
    },
  },
  mounted() {
    if (this.getUserIsRegistered) {
      this.updateInfo();
    }
  },
  methods: {
    ...mapActions([
      'updateUser',
      'refreshUserInfo',
      'setInfoMsg',
      'fetchPreferences',
      'updatePreferences',
    ]),
    async updateInfo() {
      const user = this.getUserInfo;
      this.isEmailEnabled = (user.isEmailEnabled !== false);
      this.isEmailPreviouslyEnabled = this.isEmailEnabled;
      const { paymentRedirectWhiteList } = await this.fetchPreferences();
      this.viewModelPaymentRedirectWhitelist = paymentRedirectWhiteList.map(x => ({ url: x, err: '' }));
    },
    async confirmChanges() {
      this.isLoading = true;
      try {
        const user = this.getUserInfo;
        const userInfo = {
          isEmailEnabled: this.isEmailEnabled,
        };
        await this.updateUser(userInfo);
        await this.updatePreferences({
          paymentRedirectWhiteList: this.actualPaymentRedirectWhitelist,
        });
        this.setInfoMsg(`${this.$t('Register.form.label.updatedInfo')}  <a href="/${this.user}">${this.$t('Register.form.label.viewPage')}</a>`);
        this.refreshUserInfo(user.user);
        this.viewModelPaymentRedirectWhitelist = this.actualPaymentRedirectWhitelist.map(x => ({ url: x, err: '' }));
      } catch (err) {
        console.error(err);
        this.isEmailEnabled = this.isEmailPreviouslyEnabled;
      }
      this.isLoading = false;
    },
    deleteAccount() {
      logTrackerEvent(this, 'Settings', 'deleteAccount', 'User wants to delete account', 1);
      if (window.$crisp) {
        window.$crisp.push(['do', 'chat:open']);
        window.$crisp.push(['do', 'message:send', ['text', this.$t('Settings.label.deleteAccountPrePopulatedMessage')]]);
      }
    },
    deleteUrl(i) {
      this.viewModelPaymentRedirectWhitelist.splice(i, 1);
    },
    // https://stackoverflow.com/a/43467144/7978205
    isValidHttpUrl(string) {
      let url;

      try {
        url = new URL(string);
      } catch (_) {
        return false;
      }

      return url.protocol === 'http:' || url.protocol === 'https:';
    },
    urlClass(obj) {
      return {
        'md-invalid': !!obj.err,
      };
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
