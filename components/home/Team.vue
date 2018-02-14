<template>
  <no-ssr>
    <div class="team-row">
      <div class="cards">
        <team-member-card
          v-for="(teamMember, index) in teamMembers"
          :key="index"
          :teamMember="teamMember"
        />
        <team-member-card
          v-for="n in numDummyItem"
          :key="index"
          :isDummy="true"
        />
      </div>

      <!-- <div class="team-carousel" v-else>
        <div v-swiper:mySwiper="swiperOptions">
          <div class="swiper-wrapper">
            <div
              class="swiper-slide"
              v-for="(teamMember, index) in teamMembers"
              :key="index">
              <team-member-card
                :teamMember="teamMember"
              />
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </no-ssr>
</template>

<script>
import teamMembers from '~/constant/home/team';

import TeamMemberCard from './TeamMemberCard';


function getTeamMemberDetails(member) {
  return ({
    ...member,
    icon: `${member.key}.png`,
    name: `Home.Team.member.${member.key}.name`,
    title: `Home.Team.member.${member.key}.title`,
  });
}

function getSwiperParams() {
  if (process.browser) {
    const windowWidth = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
    const containerWidth = (windowWidth > 1440) ? 1440 : windowWidth;

    let windowConfig;

    if (windowWidth <= 600) {
      windowConfig = {
        minCardSize: 136,
        windowPadding: 32,
      };
    } else if (windowWidth <= 960) {
      windowConfig = {
        minCardSize: 188,
        windowPadding: 112,
      };
    } else {
      windowConfig = {
        minCardSize: 188,
        windowPadding: 224,
      };
    }

    const swiperWidth = containerWidth - windowConfig.windowPadding;
    const numFounderInRow = Math.max(Math.floor(swiperWidth / (windowConfig.minCardSize + 16)), 1);
    /* eslint-disable */

    // only show swiper when maximum item can show <= 2
    // const shouldShowSwiper = numFounderInRow <= 2;
    const numDummyItem = (
      teamMembers.length > numFounderInRow &&
      teamMembers.length % numFounderInRow !== 0
    ) ?
      numFounderInRow - (teamMembers.length % numFounderInRow) :
      0;

    console.log({
      windowConfig,
      numFounderInRow,
      numDummyItem,
    });


    return {
      // shouldShowSwiper,
      numDummyItem,
      // swiperOptions: {
      //   slidesPerView: numFounderInRow,
      //   spaceBetween: 16,
      //   slidesPerGroup: 1,
      //   pagination: {
      //     el: '.swiper-pagination',
      //     clickable: true,
      //   },
      //   navigation: {
      //     nextEl: '.swiper-button-next',
      //     prevEl: '.swiper-button-prev',
      //   },
      // },
    };
  }
  return {
    numDummyItem: 0,
    // shouldShowSwiper: false,
  };
}

export default {
  name: 'team',
  components: {
    TeamMemberCard,
  },
  data() {
    return {
      ...getSwiperParams(),
      teamMembers: teamMembers.map(getTeamMemberDetails),
    };
  },
  methods: {
    onResize() {
      const newSwiperObject = getSwiperParams();
      Object.keys(newSwiperObject).forEach((key) => {
        this[key] = newSwiperObject[key];
      });
    },
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
  },
  mounted() {
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/index";

.team-row {
  display: flex;
  flex-direction: column;

  .cards {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;

    > div {
      flex-basis: auto;
      flex-grow: 1;
    }
  }
}

@media (max-width: 768px) {
  body #team {
    margin-top: 24px;

    .section-title-wrapper {
      > .title {
        font-size: 24px;
        line-height: 40px;
      }
    }

    .team-row {
      padding: 0 12px;

      .experience {
        flex-direction: column;

        .title {
          margin-bottom: 8px;
        }

        .description > div {
          margin-top: 12px;

          .header {
            &.big { font-size: 18px; }
            &.small { font-size: 16px; }
          }
        }
      }
    }

  }
}

@media (max-width: 600px) {
  .section-title-wrapper {
    width: unset !important;
  }

  .cards {
    margin: 0 -16px;
    .cards {
      max-width: unset !important;
    }
  }
}
</style>
