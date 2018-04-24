<template>
  <div
    :class="[
      'mission-list',
      layout,
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
            :layout="layout"
            :mission="m"
            :is-referral="isReferral"
            @click="onClick(m)" />
        </li>

        <li v-for="p in 3" :key="p.id" v-if="missions.length <= 0">
          <mission-item-placeholder :layout="layout"/>
        </li>
      </ul>

    </div>
  </div>
</template>


<script>
import MissionItem from './Item';
import MissionItemPlaceholder from './ItemPlaceholder';

export default {
  name: 'mission-list',
  props: {
    layout: {
      type: String,
      validator(value) {
        return ['small', 'large', 'fluid'].indexOf(value) !== -1;
      },
      default: 'fluid',
    },
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
      default: true,
    },
    isReferral: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    MissionItem,
    MissionItemPlaceholder,
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

@mixin large-mission-list {
  header {
    display: none;
  }

  &.grid {
    ul {
      flex-wrap: wrap;

      margin: -8px;

      li {
        padding: 8px;
      }
    }
  }

  &:not(.grid) {
    ul {
      overflow-x: auto;

      padding-bottom: 18px;

      li {
        box-sizing: content-box;
        width: 188px;
        min-width: 188px;

        &:not(:first-child) {
          padding-left: 8px;
        }

        &:not(:last-child) {
          padding-right: 8px;
        }
      }
    }
  }

  li:last-child .mission-item-placeholder {
    display: none;
  }
}

@mixin small-mission-list() {
  ul {
    flex-direction: column;

    margin: -4px;

    li {
      padding: 4px;
    }
  }
}

.mission-list {
  &.small {
    @include small-mission-list();
  }

  &.large {
    @include large-mission-list();
  }

  &.fluid {
    @media (min-width: 600px + 1px) {
      @include large-mission-list();
    }

    @media (max-width: 600px) {
      @include small-mission-list();
    }

    ul li {
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

ul {
  display: flex;

  padding: 0;

  list-style: none;
}

.column-labels {
  padding: 4px 10px;

  text-align: right;

  color: $like-green;

  font-size: 12px;
}
</style>
