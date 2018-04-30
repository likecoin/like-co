<template>
  <div class="invitee-mission-list">
    <div>
      <header>
        <div class="user-profile">
          <img class="avatar" :src="avatar" />
          <span class="username-label">{{ username }}</span>
          <span v-if="isNew" class="new-label" />
        </div>
      </header>

      <mission-list
        layout="small"
        :missions="missions"
        :username="username"
        :is-swippable="false"
        :is-referral="true"
        @click="onClick"
      />

    </div>
  </div>
</template>


<script>
import MissionList from './List';

export default {
  name: 'invitee-mission-list',
  props: {
    avatar: {
      type: String,
    },
    username: {
      type: String,
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
  components: {
    MissionList,
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
  display: flex;
  align-items: center;

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

  top: 50%;
  right: 0;

  transform: translateY(-50%);

  margin-right: 8px;
  margin-bottom: 4px;

  &::after {
    content: "NEW";

    font-size: 12px;
    font-weight: 600;
    line-height: 1;
  }
}
</style>
