<template>
  <div class="invitee-mission-grid-list">

    <header>
      <div>
        <h2 class="lc-font-size-14 lc-color-like-gray-4 lc-margin-bottom-4">
          {{ $t('BonusPage.header.inviteeMission') }}
        </h2>
        <p class="lc-font-size-14 lc-bg-gray-9b">
          {{ $t('BonusPage.label.inviteeMissionDescription') }}
        </p>
      </div>
    </header>

    <div>
      <ul class="lc-mobile-hide">
        <li v-for="i in INVITEES" :key="i.username">
          <invitee-list
            :missions="i.missions"
            :is-small="true"
            @click="onClick" />
        </li>
      </ul>
      <ul class="lc-mobile-show">
        <swiper>
          <li class="swiper-slide" v-for="i in INVITEES" :key="i.username">
            <invitee-list
              :missions="i.missions"
              :username="i.username"
              :is-small="true"
              @click="onClick" />
          </li>
        </swiper>
      </ul>
    </div>

  </div>
</template>


<script>
import InviteeList from './InviteeList';
import Swiper from './Swiper';

const INVITEES = [
  {
    username: 'joshkiu',
    isNew: true,
    missions: [
      {
        id: '2',
        title: 'Invite Friends',
        reward: '8 LIKE <span class="small">(each)</span>',
        state: 'claimed',
      },
      {
        id: '3',
        title: 'Join Token Sale',
        reward: '100 LIKE',
        state: 'active',
      },
    ],
  },
  {
    username: 'ckxpress',
    isNew: true,
    missions: [
      {
        id: '2',
        title: 'Invite Friends',
        reward: '8 LIKE <span class="small">(each)</span>',
        state: 'claimed',
      },
      {
        id: '3',
        title: 'Join Token Sale',
        reward: '100 LIKE',
        state: 'completed',
      },
      {
        id: '4',
        title: 'Invite Friends to Join Token Sale',
        reward: '2.5% <span class="small">bonus</span>',
        state: 'active',
        isNew: true,
      },
    ],
  },
  {
    username: 'williamchong007',
    isNew: true,
    missions: [
      {
        id: '2',
        title: 'Invite Friends',
        reward: '8 LIKE <span class="small">(each)</span>',
        state: 'active',
      },
    ],
  },
  {
    username: 'mileswong',
    isNew: true,
    missions: [
      {
        id: '3',
        title: 'Join Token Sale',
        reward: '100 LIKE',
        state: 'completed',
      },
      {
        id: '4',
        title: 'Invite Friends to Join Token Sale',
        reward: '2.5% <span class="small">bonus</span>',
        state: 'active',
        isNew: true,
      },
    ],
  },
  {
    username: 'simonbut',
    isNew: true,
    missions: [
      {
        id: '3',
        title: 'Join Token Sale',
        reward: '100 LIKE',
        state: 'active',
      },
      {
        id: '4',
        title: 'Invite Friends to Join Token Sale',
        reward: '2.5% <span class="small">bonus</span>',
        state: 'active',
        isNew: true,
      },
    ],
  },
];

export default {
  name: 'invitee-mission-grid-list',
  components: {
    InviteeList,
    Swiper,
  },
  data() {
    return {
      INVITEES,
    };
  },
  methods: {
    onClick(mission) {
      this.$emit('click', mission);
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

@mixin header($percent) {
  &::after {
    width: calc(#{100% - $percent} - 16px);
  }

  > div {
    max-width: $percent;
  }
}

header {
  position: relative;

  > div {
    width: 100%;
  }

  @media (min-width: 1366px + 1px) {
    @include header(25%);
  }

  @media (min-width: 960px + 1px) and (max-width: 1366px) {
    @include header(1 / 3 * 100%);
  }

  @media (min-width: 600px + 1px) {
    &::after {
      position: absolute;
      top: 50%;
      right: 0;

      height: 1px;
      margin-right: 8px;
      margin-left: 8px;

      content: " ";

      background-color: #E6E6E6;
    }

    @media (max-width: 960px) {
      @include header(50%);
    }
  }

  @media (max-width: 600px) {
    padding-bottom: 16px;
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
