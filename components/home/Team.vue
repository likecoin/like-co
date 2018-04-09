<template>
  <section class="lc-container-1 lc-team" id="team">
    <div class="lc-container-header">
      <div class="lc-container-2 lc-container-header-overlay">
        <div class="lc-container-3 lc-bg-gray-1 lc-mobile-hide" />
      </div>
      <div class="lc-container-2">
        <div class="lc-container-3">
          <div class="lc-container-4">
            <div class="lc-container-header-title">
              <h1 class="lc-font-size-32 lc-mobile">
                {{ $t('Home.Team.title') }}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="lc-container-2">
      <div class="lc-container-3 lc-bg-gray-1">
        <div class="lc-container-4">
          <avatar-grid :items="teamMembers" class="lc-padding-vertical-16" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import teamMembers from '~/constant/home/team';

import AvatarGrid from '../AvatarGrid';


export default {
  name: 'team',
  components: {
    AvatarGrid,
  },
  data() {
    return {
      teamMembers: teamMembers.map(this.translateTeamMember),
    };
  },
  methods: {
    translateTeamMember({ key, platforms }) {
      return {
        title: this.$t(`Home.Team.member.${key}.name`),
        subtitle: this.$t(`Home.Team.member.${key}.title`),
        avatar: `/images/team/${key}.png`,
        platforms,
      };
    },
  },
};
</script>
