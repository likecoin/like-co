<template>
  <div class="invitee-mission-list">
    <div>
      <header>
        <div class="user-profile">
          <img
            :src="avatar"
            class="avatar"
          >
          <nuxt-link
            :to="{ name: 'id', params: { id: invitee.id } }"
            class="username-label"
          >{{ invitee.displayName }}</nuxt-link>
          <span
            v-if="!isSeen"
            class="new-label"
            @click="onSeen"
          />
        </div>
      </header>

      <mission-list
        :missions="missions"
        :invitee="invitee"
        :bonus-cooldown="bonusCoolDown"
        :is-swippable="false"
        :is-referral="true"
        layout="small"
        @click="onClick"
      />

    </div>
  </div>
</template>


<script>
import MissionList from './List';

export default {
  name: 'invitee-mission-list',
  components: {
    MissionList,
  },
  props: {
    avatar: {
      type: String,
      default: '',
    },
    invitee: {
      type: Object,
      default: () => {},
    },
    bonusCoolDown: {
      type: Number,
      default: 0,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    missions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isSeen: !this.isNew,
    };
  },
  methods: {
    onClick(mission) {
      this.$emit('click', { mission, referralId: this.invitee.id });
    },
    onSeen() {
      this.isSeen = true;
      this.$emit('seen', { referralId: this.invitee.id });
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.invitee-mission-list {
  padding-top: 16px;
}

.user-profile {
  position: relative;

  display: flex;
  align-items: center;

  .avatar {
    width: 52px;
    height: 52px;
    margin-right: 18px;

    border: solid 1px $like-gray-3;
    border-radius: 50%;
    background-color: $like-gray-2;
  }

  .username-label {
    font-size: 18px;
    font-weight: 600;
  }
}

.new-label {
  position: absolute;

  top: 50%;
  right: 0;

  display: flex;
  align-items: center;

  margin-right: 8px;
  margin-bottom: 4px;

  cursor: pointer;

  transform: translateY(-50%);

  color: #ff5151;

  &:before {
    width: 6px;
    height: 6px;
    margin: 3px 6px;

    content: " ";

    border-radius: 50%;
    background-color: currentColor;
    box-shadow: 0 0 6px 0 #FF4949;
  }

  &::after {
    content: "NEW";

    font-size: 12px;
    font-weight: 600;
    line-height: 1;
  }
}
</style>
