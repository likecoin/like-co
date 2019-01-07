<template>
  <form
    :id="formId"
    :class="['external-link', { disabled: isLoading }]"
    @submit.prevent="onClickEdit"
  >
    <div class="external-link__left-wrapper">
      <!-- BEGIN - Draggable handle -->
      <div v-if="!isNew">
        <simple-svg
          :filepath="DragIcon"
          class="external-link__handle"
          fill="#9b9b9b"
          height="24px"
          width="12px"
        />
      </div>
      <!-- END - Draggable handle -->

      <simple-svg
        :filepath="getIconPath(iconTypeModel || iconType)"
        class="external-link__platform-icon"
        fill="#4a4a4a"
        height="28px"
        width="28px"
      />

      <div v-if="isEdit">
        <lc-tooltip
          ref="tooltip"
          :is-listen-to-hover="false"
        >
          <div
            slot="activator"
            class="external-link__expand-icon"
            @click="isIconExpanded = true"
          >
            <simple-svg
              :filepath="ExpandIcon"
              fill="#4a4a4a"
              height="7px"
              width="12px"
            />
          </div>

          <div class="external-link__tooltip-content">
            <md-button
              v-for="type in LINK_ICON_TYPES"
              :key="type"
              class="md-icon-button"
              @click="onSelectLinkType(type)"
            >
              <simple-svg
                :filepath="getIconPath(type)"
                fill="#4a4a4a"
                height="28px"
                width="28px"
              />
            </md-button>
          </div>
        </lc-tooltip>
      </div>

      <input
        v-model="siteDisplayNameInputValue"
        v-if="isEdit"
        :class="{
          invalid: !siteDisplayNameInputValue,
          'no-content': !siteDisplayNameInputValue,
        }"
        :placeholder="$t('Settings.placeholder.name')"
      >
      <span
        v-else
        class="external-link__name"
      >{{ siteDisplayNameInputValue || siteDisplayName }}</span>
    </div>

    <div class="external-link__right-wrapper">
      <input
        v-model="urlInputValue"
        v-if="isEdit"
        :class="{
          invalid: !isValidUrl,
          'no-content': !urlInputValue,
        }"
        :placeholder="$t('Settings.placeholder.enterUrl')"
      >
      <span
        v-else
        class="external-link__url"
      >{{ urlInputValue || url }}</span>

      <md-button
        v-if="isEdit"
        :disabled="isEdit && !isValidInput"
        :form="formId"
        type="submit"
        class="md-icon-button"
      >
        <div>
          <simple-svg
            :filepath="TickIcon"
            height="21px"
            width="21px"
            fill="#4a4a4a"
          />
        </div>
      </md-button>
      <md-button
        v-else
        class="md-icon-button"
        @click="onClickEdit"
      >
        <span>
          <simple-svg
            :filepath="EditIcon"
            height="24px"
            width="24px"
            fill="#4a4a4a"
          />
        </span>
      </md-button>

      <template v-if="isEdit">
        <md-button
          class="md-icon-button"
          @click="onClickCancel"
        >
          <simple-svg
            :filepath="CrossIcon"
            fill="#4a4a4a"
            height="24px"
            width="24px"
          />
        </md-button>

        <hr>

        <md-button
          :disabled="isNew"
          class="md-icon-button"
          @click="onClickDelete"
        >
          <simple-svg
            :filepath="DeleteIcon"
            fill="#4a4a4a"
            height="24px"
            width="24px"
          />
        </md-button>
      </template>
    </div>

  </form>
</template>

<script>
import LcTooltip from '@/components/settings/Tooltip';

import CrossIcon from '@/assets/icons/cross.svg';
import DeleteIcon from '@/assets/icons/delete.svg';
import DragIcon from '@/assets/icons/drag.svg';
import EditIcon from '@/assets/icons/pencil.svg';
import ExpandIcon from '@/assets/icons/expand.svg';
import TickIcon from '@/assets/tokensale/tick.svg';
import LikeCoinIcon from '@/assets/logo/icon.svg';

import { LINK_ICON_TYPES } from '@/constant';
import { isValidSocialLink } from '@/util/social';

const iconFolder = require.context('../../assets/icons/social-media/link/');

export default {
  name: 'external-link',
  components: {
    LcTooltip,
  },
  props: {
    id: {
      type: String,
      default: null,
    },
    iconType: {
      type: String,
      default: LINK_ICON_TYPES[0],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    siteDisplayName: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: null,
    },
    url: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      CrossIcon,
      DeleteIcon,
      DragIcon,
      EditIcon,
      ExpandIcon,
      TickIcon,
      isEdit: false,
      isIconExpanded: false,
      isNew: false,
      siteDisplayNameInputValue: '',
      urlInputValue: '',
      iconTypeModel: '',
      LINK_ICON_TYPES,
    };
  },
  computed: {
    formId() {
      return `external-link-${this.id}`;
    },
    isValidUrl() {
      return !!this.urlInputValue && isValidSocialLink(this.urlInputValue);
    },
    isValidInput() {
      return !!this.siteDisplayNameInputValue && this.isValidUrl;
    },
  },
  mounted() {
    if (!this.siteDisplayName && !this.url) {
      // newly added link
      this.isEdit = true;
      this.isNew = true;
    }
  },
  methods: {
    onClickEdit() {
      if (this.isEdit) {
        // submit changes
        const link = {};
        if (this.siteDisplayNameInputValue !== this.siteDisplayName) {
          link.siteDisplayName = this.siteDisplayNameInputValue;
        }
        if (this.urlInputValue !== this.url) {
          link.url = this.urlInputValue;
        }
        if (this.iconTypeModel !== this.iconType) {
          link.iconType = this.iconTypeModel || this.iconType;
        }
        if (Object.keys(link).length > 0) {
          link.id = this.id;
          this.$emit('change', link);
        }
        this.isEdit = false;
      } else {
        // show edit form
        if (!this.siteDisplayNameInputValue) {
          this.siteDisplayNameInputValue = this.siteDisplayName;
        }
        if (!this.urlInputValue) {
          this.urlInputValue = this.url;
        }
        if (!this.iconTypeModel) {
          this.iconTypeModel = this.iconType;
        }

        this.isEdit = true;
      }
    },
    onClickCancel() {
      this.isEdit = false;
      if (this.isNew) {
        this.onClickDelete();
      }
    },
    onClickDelete() {
      this.$emit('remove', {
        id: this.id,
        order: this.order,
      });
    },
    onSelectLinkType(type) {
      this.iconTypeModel = type;
      if (this.$refs.tooltip) {
        this.$refs.tooltip.setContentVisibility(false, 0);
      }
    },
    getIconPath(type) {
      try {
        return iconFolder(`./${type}.svg`);
      } catch (error) {
        return LikeCoinIcon;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

$shake-x: 4px;

@keyframes shake {
  0% {
    transform: translateX(-#{$shake-x});
  }
  25% {
    transform: translateX($shake-x);
  }
  50% {
    transform: translateX(-#{$shake-x});
  }
  75% {
    transform: translateX($shake-x);
  }
  100% {
    transform: translateX(0px);
  }
}

.external-link {
  display: flex;
  justify-content: space-between;

  min-height: 40px;

  color: $like-gray-5;
  border-top: $border-style-1;

  &.disabled {
    cursor: none;
    user-select: none;

    opacity: 0.6;
  }

  > * {
    display: flex;
    align-items: center;

    @media (max-width: 600px) {
      width: 50% !important;
    }
  }

  &__left-wrapper {
    width: 1 / 3 * 100%;
    margin-right: 8px;
  }

  &__right-wrapper {
    display: flex;
    justify-content: flex-end;

    width: 2 / 3 * 100%;
  }

  &__handle {
    cursor: move;
  }

  &__name {
    max-width: 144px;
    margin-left: 8px;

    font-weight: 600;
  }

  &__url {
    max-width: 336px;
    margin-right: 16px;

    word-break: break-all;
  }

  &__expand-icon {
    margin: 0 12px 0 8px;

    cursor: pointer;
  }

  &__tooltip-content {
    display: flex;

    .md-button {
      margin: 4px;
    }
  }

  &:last-child {
    border-bottom: $border-style-1;
  }

  &__platform-icon {
    width: 28px;
    height: 28px;
    margin-left: 8px;
  }

  input {
    width: 100%;
    height: 32px;
    margin-right: 8px;
    padding: 12px;

    transition: box-shadow 0.2s ease-in-out;

    border: $border-style-1;
    border-radius: 4px;
    outline: none;

    font-size: 14px;

    &:invalid,
    &.invalid {
      box-shadow: 0px 0px 2px $like-red;

      &:not(:focus) {
        animation: shake 0.3s ease;
      }
    }

    &.no-content {
      animation: none !important;
    }
  }

  hr {
    height: 60%;
    margin: 0 8px;

    border: none;
    border-left: $border-style-2;
  }

  :global(.lc-tooltip__content) {
    background-color: $gray-e6;
  }
  :global(.lc-tooltip__content:after) {
    border-bottom-color: $gray-e6;
  }
  :global(.lc-tooltip__content:before),
  :global(.lc-tooltip__content:after) {
    left: 7px;
  }
}

.md-icon-button {
  width: 24px;
  min-width: 24px;
  height: 24px;
  margin: 0;

  &[disabled="disabled"] {
    opacity: 0.3;
  }
}
</style>
