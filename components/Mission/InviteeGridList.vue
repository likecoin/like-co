<template>
  <div class="invitee-mission-grid-list">

    <ul class="lc-mobile-hide">
      <li
        v-for="i in invitees"
        :key="i.id"
      >
        <invitee-list
          :missions="i.missions"
          :username="i.id"
          :avatar="i.avatar"
          :isNew="!i.seen"
          :bonusCoolDown="i.bonusCooldown"
          @click="onClick"
        />
      </li>
    </ul>

    <swiper
      :swiper-id="swiperId"
      :is-show-pagination="invitees && invitees.length > 1"
      class="lc-mobile-show"
      @slideChange="onSlideChange"
    >
      <div
        v-for="i in invitees"
        :key="i.id"
        class="swiper-slide"
      >
        <div class="lc-container-3">
          <div class="lc-container-4">
            <invitee-list
              :missions="i.missions"
              :username="i.id"
              :avatar="i.avatar"
              :isNew="!i.seen"
              @click="onClick"
            />
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
  components: {
    InviteeList,
    Swiper,
  },
  props: {
    invitees: {
      type: Array,
      default: () => [],
    },
    swiperId: {
      type: String,
      default: undefined,
    },
  },
  methods: {
    onClick({ mission, referralId }) {
      this.$emit('click', { mission, referralId });
    },
    onSlideChange({ activeIndex }) {
      const activeInvitee = this.invitees[activeIndex];

      if (activeInvitee && !activeInvitee.seen) {
        this.$emit('slideChange', {
          referralId: activeInvitee.id,
        });
      }
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
