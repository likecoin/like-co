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
          <span>LIKE</span>
        </div>
      </header>

      <ul>
        <li v-for="t in missions" :key="t.id">
          <mission-item
            :title="t.title"
            :reward="t.reward"
            :state="t.state"
            :is-new="!!t.isNew"
            @click="onClick(t)" />
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
  },
  components: {
    MissionItem,
  },
  methods: {
    onClick(t) {
      if (this.state !== 'claimed') {
        this.$emit('click', t);
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
      padding: 8px;

      .mission-list.large:not(.grid) & {
        box-sizing: content-box;
        min-width: 188px;
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

        @media (max-width: 732px) {
          width: 1 / 2 * 100%;
        }

        @media (max-width: 472px) {
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
