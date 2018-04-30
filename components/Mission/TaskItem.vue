<template>
  <div :class="['task-item', state]" @click="onClick">
    <div>
      <h1 class="title-label">{{ title }}</h1>
    </div>
  </div>
</template>


<script>
export default {
  name: 'task-item',
  props: {
    title: {
      type: String,
    },
    state: {
      validator(value) {
        return value === 'active' || value === 'completed';
      },
      default: 'active',
    },
  },
  methods: {
    onClick() {
      if (this.state === 'active') {
        this.$emit('click');
      }
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
  min-height: 48px;
  padding: 8px 12px 8px 40px;

  user-select: none;
  word-break: break-word;

  border: solid 2px #e6e6e6;
  border-radius: 4px;

  &.active {
    cursor: pointer;
    transition: transform .2s ease-out,
                box-shadow .2s ease-out,
                border-color .2s ease-out;

    background-color: $like-gray-1;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.0);

    &:hover {
      transform: translateY(-1px);

      border-color: $like-gray-4;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.3);
    }

    &:active {
      transform: translateY(0);

      box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.3);
    }

    &::before {
      mask: url('~/assets/mission/misc/active-small.svg');
      background-color: $like-green;
    }
  }

  &.completed {
    background-color: $like-white;

    &::before {
      mask: url('~/assets/mission/misc/completed-small.svg');
      background-color: $like-green-2;
    }
  }

  &::before {
    position: absolute;
    top: 6px;
    left: 4px;

    width: 32px;
    height: 32px;

    content: "";
  }
}

.title-label {
  margin-top: 8px;

  font-size: 14px;
  font-weight: 600;
  line-height: 16px;

  .active & {
    color: $like-green;
  }

  .completed & {
    color: $like-green-2;
  }
}
</style>
