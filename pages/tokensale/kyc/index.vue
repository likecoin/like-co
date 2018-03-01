<template>
  <form id="kycForm" @submit.prevent="onNext">
    <section v-if="stage == 0">
      <div class="md-layout">
        <label class="md-layout-item md-size-100">Are you a citizen of PRC?</label>
        <div class="md-layout md-layout-item">
          <md-radio v-model="notPRC" class="md-layout-item" :value="false">Yes</md-radio>
          <md-radio v-model="notPRC" class="md-layout-item" :value="true">No</md-radio>
        </div>
      </div>
      <div class="md-layout">
        <label class="md-layout-item md-size-100">Are you a citizen of USA?</label>
        <div class="md-layout md-layout-item">
          <md-radio v-model="notUSA" name="isUSA" class="md-layout-item" :value="false">Yes</md-radio>
          <md-radio v-model="notUSA" name="isUSA" class="md-layout-item" :value="true">No</md-radio>
        </div>
      </div>
    </section>
    <section v-else-if="stage == 1">
      <div v-if="isPRC || isUSA">
        Please contact us in intercom directly
      </div>
      <div v-else class="md-layout">
        <label class="md-layout-item md-size-100">Are you going to purchase more than USD10000?</label>
        <div class="md-layout md-layout-item">
          <md-radio v-model="isBelowThersold" class="md-layout-item" :value="false">Yes</md-radio>
          <md-radio v-model="isBelowThersold" class="md-layout-item" :value="true">No</md-radio>
        </div>
      </div>
    </section>
    <section v-else-if="stage == 2">
      <div v-if="isBelowThersold">
        Please Sign your transaction and confirm!
      </div>
      <div v-else class="md-layout">
        <!-- TODO: upload -->
      </div>
    </section>
    <md-button v-if="!ended" type="submit" form="kycForm">Next</md-button>
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import User from '@/util/User';

export default {
  name: 'KYC',
  layout: 'baseWithBackground',
  data() {
    return {
      stage: 0,
      notPRC: true,
      notUSA: true,
      isBelowThersold: true,
      ended: false,
    };
  },
  // fetch({ store, redirect }) {
  //   if (!store.getters.getUserIsRegistered) {
  //     redirect({ name: 'register' });
  //   }
  // },
  computed: {
    ...mapGetters({
      isEdit: 'getUserIsRegistered',
      user: 'getUserInfo',
      wallet: 'getLocalWallet',
    }),
  },
  methods: {
    ...mapActions([
      'sendKYC',
    ]),
    async onNext() {
      switch (this.stage) {
        case 0: {
          this.stage += 1;
          if (!this.notPRC || !this.notUSA) {
            if (this.$intercom) this.$intercom.show();
            this.ended = true;
          }
          break;
        }
        case 1: {
          this.stage += 1;
          if (this.isBelowThersold) {
            const {
              notPRC,
              notUSA,
              isBelowThersold,
              wallet,
            } = this;
            const userInfo = {
              user: this.user.user,
              wallet,
              notPRC,
              notUSA,
              isBelowThersold,
            };
            this.ended = true;
            const payload = await User.formatAndSignKYC(userInfo);
            await this.sendKYC(payload);
          }
          break;
        }
        default: {
          // do nothing
          break;
        }
      }
    },
  },
};
</script>
