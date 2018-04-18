<template>
  <div :class="['task-item', state]" @click="$emit('click')">
    <span class="title">{{ title }}</span>
  </div>
</template>


<script>
export default {
  name: 'task-item',
  props: {
    mission: {
      type: Object,
      default: {},
    },
  },
  computed: {
    title() {
      return this.$t(`This.mission.${this.mission.id}.title`);
    },
    state() {
      return Math.random() > 0.5 ? 'completed' : 'active';
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.task-item {
  position: relative;

  box-sizing: border-box;
  width: 100%;
  padding: 8px 10px 8px 40px;

  cursor: pointer;
  user-select: none;
  word-break: break-word;

  border: solid 2px #e6e6e6;
  border-radius: 4px;

  &.completed {
    color: $like-green-2;
    background-color: $like-white;

    &::before {
      background-image: url('~/assets/icons/mission/task-completed.svg');
    }
  }

  &.active {
    color: $like-green;
    background-color: $like-gray-1;

    &::before {
      background-image: url('~/assets/icons/mission/active-small.svg');
    }
  }

  &::before {
    position: absolute;
    bottom: 50%;
    left: 4px;

    transform: translateY(50%);

    width: 32px;
    height: 32px;

    content: " ";
  }

  .title {
    font-weight: 600;
  }
}
</style>
