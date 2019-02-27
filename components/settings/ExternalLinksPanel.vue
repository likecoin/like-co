<template>
  <div class="external-links-panel">

    <h2 class="lc-font-size-14 lc-font-weight-400">
      {{ $t('Settings.label.otherLinks') }}
    </h2>
    <p class="lc-font-size-14 lc-color-gray-9b lc-margin-top-8">
      {{ $t('Settings.label.otherLinksDescription') }}
    </p>

    <div class="external-links-panel__draggable-wrapper lc-margin-top-32">
      <md-progress-bar
        v-if="isShowProgressBar"
        md-mode="indeterminate"
      />
      <draggable
        v-model="links"
        :options="{ handle: '.external-link__handle' }"
        :class="{ disabled: isUpdatingOrder }"
        @end="onEnd"
      >
        <transition-group name="move-link-order">
          <external-link
            v-for="link in links"
            :key="link.id"
            v-bind="link"
            :is-loading="loadingLinkIds.includes(link.id)"
            @change="onChangeLink"
            @remove="onRemoveLink"
          />
        </transition-group>
      </draggable>
      <external-link
        v-if="hasNewLink"
        :is-loading="isAddingLink"
        class="external-links-panel__new-item"
        @change="onChangeLink"
        @remove="onRemoveLink"
      />
    </div>

    <md-button
      class="lc-margin-top-16"
      @click="onClickAddLink"
    >
      <simple-svg
        :filepath="AddIcon"
        fill="#c0c0c0"
        height="24px"
        width="24px"
      />
      <span class="lc-underline lc-color-like-gray-4 lc-font-weight-600">
        {{ $t('Settings.button.addCustomLink') }}
      </span>
    </md-button>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Draggable from 'vuedraggable';

import ExternalLink from '@/components/settings/ExternalLink';

import AddIcon from '@/assets/icons/social-media/add.svg';

export default {
  name: 'external-links-panel',
  components: {
    Draggable,
    ExternalLink,
  },
  data() {
    return {
      AddIcon,
      loadingLinkIds: [],
      links: [],
      hasNewLink: false,
      isUpdatingOrder: false,
      isAddingLink: false,
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserSocialLinks',
    ]),
    isShowProgressBar() {
      return this.isUpdatingOrder || this.isAddingLink || this.loadingLinkIds.length > 0;
    },
  },
  watch: {
    getUserSocialLinks(links) {
      this.updateUserSocialLinkList(links);
    },
  },
  mounted() {
    this.updateUserSocialLinkList(this.getUserSocialLinks);
  },
  methods: {
    ...mapActions([
      'addUserSocialLink',
      'updateUserSocialLink',
      'unlinkSocialPlatform',
    ]),
    updateUserSocialLinkList(list) {
      const links = Object.keys(list).map(id => ({
        id,
        ...list[id],
      }));
      this.links = links.sort((link1, link2) => link1.order - link2.order);
    },
    onClickAddLink() {
      this.hasNewLink = true;
    },
    spliceLoadingId(linkId) {
      const index = this.loadingLinkIds.findIndex(id => id === linkId);
      if (index >= 0) {
        this.loadingLinkIds.splice(index, 1);
      }
    },
    async onEnd({ newIndex, oldIndex }) {
      // swap links order
      if (newIndex !== oldIndex) {
        const indexOffset = newIndex < oldIndex ? 1 : -1;
        this.onChangeLink({
          id: this.links[newIndex].id,
          order: this.links[newIndex + indexOffset].order,
        });
      }
    },
    async onChangeLink(link) {
      const payload = {
        user: this.getUserInfo.user,
        link,
      };
      if (!link.id) {
        this.isAddingLink = true;
        await this.addUserSocialLink(payload);
        this.isAddingLink = false;
        this.hasNewLink = false;
      } else {
        if (link.order !== undefined) {
          this.isUpdatingOrder = true;
        } else {
          this.loadingLinkIds.push(link.id);
        }

        await this.updateUserSocialLink({
          linkId: link.id,
          payload,
        });

        if (link.order !== undefined) {
          this.isUpdatingOrder = false;
        } else {
          this.spliceLoadingId(link.id);
        }
      }
    },
    async onRemoveLink({ id, order }) {
      if (order === undefined) {
        this.hasNewLink = false;
      } else {
        const index = this.links.findIndex(l => l.id === id);
        if (index >= 0) {
          this.loadingLinkIds.push(id);
          await this.unlinkSocialPlatform({
            platform: this.links[index].id,
            payload: {
              user: this.getUserInfo.user,
            },
          });
          this.spliceLoadingId(id);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.external-links-panel {
  .md-button {
    margin: 0;

    :global(.md-button-content) {
      display: flex;
      align-items: center;

      span {
        margin-left: 8px;
      }
    }
  }

  &__new-item.external-link {
    margin-top: 0;
    padding-left: 16px;

    border: 0;
  }

  &__draggable-wrapper {
    position: relative;

    .md-progress-bar {
      position: absolute;
      top: 0;
      left: 0;

      width: 100%;
      height: 2px;
    }
  }
}

.md-icon-button {
  width: 32px;
  min-width: 32px;
  height: 32px;
  margin: 0 8px 0 -4px;
}

.external-link {
  padding: 2px 4px;

  transition: all 0.2s;
}

.move-link-order-enter, .move-link-order-leave-active {
  opacity: 0;
}
</style>
