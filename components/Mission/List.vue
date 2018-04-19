<template>
  <div
    :class="[
      'mission-list',
      isSmall ? 'small' : 'large',
      {
        grid: isGrid,
      },
    ]">
    <div>

      <header>
        <div class="column-labels">
          <nuxt-link :to="{ name: 'id', params: { id: username } }"><span>LIKE</span></nuxt-link>
        </div>
      </header>

      <ul>
        <li v-for="m in missions" :key="m.id">
          <mission-item
            :mission="m"
            :isReferral="isReferral"
            @click="onClick(m)" />
        </li>
      </ul>

    </div>
  </div>
</template>


<script>
import MissionItem from './Item';

export default {
  name: 'mission-list',
  props: {
    username: {
      type: String,
      default: '',
    },
    missions: {
      type: Array,
      default: () => [],
    },
    isGrid: {
      type: Boolean,
      default: false,
    },
    isSmall: {
      type: Boolean,
      default: false,
    },
    isReferral: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    MissionItem,
  },
  methods: {
    onClick(m) {
      if (this.state !== 'claimed') {
        this.$emit('click', ({
          ...m,
          invitee: this.username,
          isReferral: this.isReferral,
        }));
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.mission-list {
  &.large {
    @media (min-width: 600px + 1px) {
      &:not(.grid) {
        max-width: 100%;
        overflow-x: auto;
      }

      > div {
          padding-bottom: 12px;
      }
    }
  }
}

ul {
  display: flex;

  margin: -4px;
  padding: 0;

  list-style: none;
  flex-direction: column;

  @media (min-width: 600px + 1px) {
    .large & {
      margin: -8px;
      flex-direction: row;
    }

    .grid.large & {
      flex-wrap: wrap;
    }
  }

  li {
    padding: 4px;

    .mission-list:not(.grid) & {
      box-sizing: content-box;
      min-width: 188px;
    }

    @media (min-width: 600px + 1px) {
      .large & {
        padding: 8px;
      }

      .mission-list.large:not(.grid) & {
        box-sizing: content-box;
        width: 188px;
      }

      .large.grid & {
        width: 1 / 6 * 100%;

        @media (max-width: 1384px) {
          width: 1 / 5 * 100%;
        }

        @media (max-width: 1188px) {
          width: 1 / 4 * 100%;
        }

        @media (max-width: 928px) {
          width: 1 / 3 * 100%;
        }

        @media (max-width: 712px) {
          width: 1 / 2 * 100%;
        }

        @media (max-width: 600px) {
          width: 100%;
        }
      }
    }
  }
}

header {
  @media (min-width: 600px + 1px) {
    .large & {
      display: none;
    }
  }

  .column-labels {
    padding: 4px 10px;

    text-align: right;

    color: $like-green;

    font-size: 12px;
  }
}
</style>
