<template>
  <div class="task-list">
    <ul>
      <li v-for="t in tasks" :key="t.id">
        <task-item
          :title="t.title"
          :state="t.state"
          @click="onClick(t)" />
      </li>
    </ul>
  </div>
</template>


<script>
import TaskItem from './TaskItem';

export default {
  name: 'task-list',
  props: {
    tasks: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    TaskItem,
  },
  methods: {
    onClick(t) {
      this.$emit('click', t);
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.task-list {
  margin: 24px 0;

  ul {

    display: flex;
    flex-direction: column;
    margin: -4px 0;

    list-style: none;

    li {
      padding: 4px 0;
    }
  }
}
</style>
