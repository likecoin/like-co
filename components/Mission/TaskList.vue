<template>
  <ul class="task-list">
    <li v-for="m in missions" :key="m.id">
      <task-item
        :mission="m"
        @click="onClick(m)" />
    </li>
  </ul>
</template>


<script>
import TaskItem from './TaskItem';

export default {
  name: 'task-list',
  props: {
    missions: {
      type: Array,
      default: [],
    },
  },
  components: {
    TaskItem,
  },
  methods: {
    onClick() {
      // do something
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.task-list {
  display: flex;
  flex-direction: column;

  list-style: none;

  li {
    padding: 4px 0;
  }
}
</style>
