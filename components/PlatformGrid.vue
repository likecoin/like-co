<template>
  <div class="platform-grid">
    <ul>
      <li
        v-for="item in items"
        :key="item.id"
        class="platform-grid__item"
      >
        <a
          :href="item.url"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img v-lazy="item.logoSrc">
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'platform-grid',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss">
@import "~assets/variables";

.platform-grid {
  ul {
    display: flex;
    flex-wrap: wrap;

    margin: -6px;
    padding: 0;

    list-style: none;
  }

  &__item {
    flex: 25%;

    padding: 6px;

    @media (max-width: 600px) {
      flex: 50%;
    }

    a {
      overflow: hidden;

      transition: transform 0.2s ease-in !important;

      border: 1px solid $gray-e6;
      border-radius: 16px;
      background: white;

      &:hover {
        transform: translateY(-4px);
      }
    }

    a, img {
      display: block;
    }

    img {
      object-fit: cover;
    }
  }
}
</style>
