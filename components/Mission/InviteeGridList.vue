<template>
  <div class="invitee-mission-grid-list">

    <ul class="lc-mobile-hide">
      <li v-for="i in invitees" :key="i.id">
        <invitee-list
          :missions="i.missions"
          :username="i.id"
          :avatar="i.avatar"
          :isNew="!i.seen"
          @click="onClick" />
      </li>
    </ul>

    <swiper class="lc-mobile-show" :swiper-id="swiperId">
      <div class="swiper-slide" v-for="i in invitees" :key="i.id">
        <div class="lc-container-3">
          <div class="lc-container-4">
            <invitee-list
              :missions="i.missions"
              :username="i.id"
              :avatar="i.avatar"
              :isNew="!i.seen"
              @click="onClick" />
          </div>
        </div>
      </div>
    </swiper>

  </div>
</template>


<script>
import InviteeList from './InviteeList';
import Swiper from './Swiper';

export default {
  name: 'invitee-mission-grid-list',
  props: {
    invitees: {
      type: Array,
      default: () => [],
    },
    swiperId: {
      type: String,
    },
  },
  components: {
    InviteeList,
    Swiper,
  },
  methods: {
    onClick({ mission, referralId }) {
      this.$emit('click', { mission, referralId });
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

@mixin separator() {
  &::before {
    position: absolute;
    right: 0;
    left: 0;

    height: 1px;
    margin-right: 8px;
    margin-left: 8px;

    content: " ";

    background-color: #E6E6E6;
  }
}

.invitee-mission-grid-list {
  ul {
    display: flex;
    flex-wrap: wrap;

    margin: 0 -4px;
    padding: 0;

    list-style: none;

    li {
      padding: 0 12px 44px;

      @media (min-width: 1366px + 1px) {
        width: 25%;

        &:nth-child(5n + 0) {
          @include separator();
        }
      }

      @media (min-width: 960px + 1px) and (max-width: 1366px) {
        width: 1 / 3 * 100%;

        &:nth-child(4n + 0) {
          @include separator();
        }
      }

      @media (min-width: 600px + 1px) and (max-width: 960px) {
        width: 50%;

        &:not(:first-child):nth-child(odd) {
          @include separator();
        }
      }

      @media (max-width: 600px) {
        width: 100%;

        @include separator();
      }
    }
  }
}
</style>
