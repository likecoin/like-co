<template>
  <div class="avatar-grid">
    <ul>

      <li
        v-for="(item, index) in items"
        :key="item.key"
      >
        <avatar-grid-card
          :key="item.key || index"
          :avatar="item.avatar"
          :title="item.title"
          :subtitle="item.subtitle"
          :description="item.description"
          :platforms="item.platforms"
        />
      </li>

    </ul>
  </div>
</template>


<script>
export default {
  name: 'avatar-grid',
  components: {
    AvatarGridCard: () => import('./AvatarGridCard'),
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
@import "~assets/variables";

.avatar-grid {

  > ul {
    display: flex;

    flex-wrap: wrap;

    margin: 0 auto;
    padding: 0;

    list-style: none;

    li {
      width: 20%;
      padding: 8px;

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
