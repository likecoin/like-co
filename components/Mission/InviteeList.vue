<template>
  <div class="invitee-mission-list">
    <div>
      <header>
        <div class="user-profile">
          <img
            :src="avatar"
            class="avatar"
          >
          <span class="username-label">{{ username }}</span>
          <span
            v-if="isNew"
            class="new-label"
          />
        </div>
      </header>

      <mission-list
        :missions="missions"
        :username="username"
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
    username: {
      type: String,
      required: true,
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
  methods: {
    onClick(mission) {
      this.$emit('click', { mission, referralId: this.username });
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
    color: $like-green;

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
