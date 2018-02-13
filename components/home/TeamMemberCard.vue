<template>
  <div>
    <div
      v-if="!isDummy"
      class="card">
      <div class="icon">
        <img :src="imgUrl(`team/${teamMember.icon}`)" />
      </div>

      <div class="details">
        <div class="name">{{ $t(teamMember.name) }}</div>
        <div class="description">{{ $t(teamMember.title) }}</div>
      </div>

      <div class="platforms">
        <md-button
          class="md-icon-button platform"
          target="_blank"
          rel="noopener noreferrer"
          v-for="(platform, index) in teamMember.platforms"
          :href="platform.value"
          :key="index"
        >
          <img alt="platform.key" :src="imgUrl(`icons/${platform.key}-dark.svg`)" />
        </md-button>
      </div>
    </div>
    <div v-else class="card dummy" />
  </div>
</template>


<script>
const images = require.context('../../assets/');
const imgUrl = path => images(`./${path}`);


export default {
  name: 'team-member-card',
  props: ['teamMember', 'isDummy'],
  methods: {
    imgUrl,
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/index";

$card-min-width-desktop: 188px;
$card-max-width-desktop: 230px;

$card-min-width-mobile: 136px;

$card-icon-size: 112px;

.card {
  min-width: $card-min-width-desktop;
  max-width: $card-max-width-desktop;
  min-height: 290px;
  margin: 8px;
  padding: 20px 0;

  border-radius: 6px;
  background-color: $like-white;

  text-align: center;

  &.dummy {
    width: $card-min-width-desktop;

    background-color: transparent;
  }

  .icon > img {
    width: $card-icon-size;
    height: $card-icon-size;

    border-radius: 50%;
  }

  .details {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 16px 0;

    > .name {
      margin-bottom: 4px;

      font-size: 20px;
      font-weight: 600;
    }
    > .description {
      color: $like-gray-4;

      font-size: 16px;
      font-weight: 300;
    }
  }

  .platforms {
    display: inline-flex;

    max-width: 100%;
    margin: 4px;

    .platform {
      &:hover {
        opacity: 0.7;
      }
    }
  }
}

@media (max-width: 600px) {
  body .card {
    min-width: $card-min-width-mobile;

    .details {
      > .name {
        font-size: 18px;
      }
      > .description {
        max-width: 128px;
      }
    }

    .platforms {
      max-width: 128px;
      .md-icon-button {
        min-width: 36px;
        width: 36px;

        :global(.md-ripple) {
          padding: 0 6px;
        }
      }
    }

    &.dummy {
      width: $card-min-width-mobile;

      background-color: transparent;
    }
  }
}

</style>
