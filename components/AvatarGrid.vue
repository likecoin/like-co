<template>
  <div class="avatar-grid">
    <ul>

      <li v-for="(item, index) in items">
        <avatar-grid-card
          :key="item.key || index"
          :avatar="item.avatar"
          :title="item.title"
          :subtitle="item.subtitle"
        />
      </li>

    </ul>
  </div>
</template>


<script>
import AvatarGridCard from './AvatarGridCard';

export default {
  name: 'avatar-grid',
  components: {
    AvatarGridCard,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/index";

.avatar-grid {

  > ul {
    display: flex;
    list-style: none;
    flex-wrap: wrap;
    margin: 0 auto;
    padding: 0;

    li {
      padding: 8px;
      width: 20%;

      @media (max-width: 1244px) {
        width: 25%;
      }
      @media (max-width: 860px) {
        width: calc(100% / 3);
      }
      @media (max-width: 640px) {
        width: 50%;
      }
      @media (max-width: 375px) {
        width: 100%;
      }
    }
  }
}
</style>
