<template>
  <nuxt />
</template>

<script>
export default {
  head() {
    return {
      htmlAttrs: {
        'likecoin-embed': undefined,
      },
    };
  },
};
</script>

<style lang="scss">
@import "~assets/embed";

$social-media-button-size: normalized(32);

html[likecoin-embed] {
  font-size: $full-width * 1px;

  @media screen and (max-width: $full-width * 1px) {
    font-size: 100vw;
  }

  .likecoin-embed {
    position: relative;

    width: normalized();
    margin-top: normalized($avatar-vertical-offset);

    user-select: none;

    &__badge {
      border-radius: normalized(8);
      background-image: linear-gradient(77deg, $like-light-blue, $like-gradient-1);

      &__content {
        position: relative;

        display: flex;
        align-items: center;

        min-height: normalized($avatar-size - $avatar-vertical-offset * 2);
        padding-right: normalized($button-width / 2 + $button-shadow-width);
      }
    }
  }

  .embed-superlike-button-wrapper {
    position: absolute;
    right: 0;

    display: flex;
    flex-direction: column;
    flex-shrink: 0;

    width: auto;
    min-width: normalized($button-width);
    height: auto;
    min-height: normalized($button-height);
    margin-right: normalized(-$button-width / 2);
    padding: normalized($button-border-width);

    &:before {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;

      content: "";
      transition: 0.4s cubic-bezier(.4, 0, .2, 1);
      transition-property: background, opacity;

      opacity: 0;
      border-radius: normalized(25);
      background: linear-gradient(67deg, $like-light-blue, $like-gradient-1);
      box-shadow: 0 normalized(2) normalized($button-shadow-width) 0 rgba(0, 0, 0, 0.25);

      // Show button border when cursor fall into root element
      body:hover & {
        opacity: 1;
      }
    }
  }

  .social-media-connect {
    margin-top: normalized(8);

    > :global(div) {
      justify-content: flex-end;

      min-height: $social-media-button-size;
      margin-left: normalized(216);

      :global(ul) {
        justify-content: flex-end;

        margin: normalized(-4) normalized(-6);

        :global(li) {
          padding: normalized(4) normalized(6);
        }
      }
    }

    :global(.social-media-connect__button) {
      display: block;

      margin: 0;

      :global(svg),
      :global(.simple-svg-wrapper) {
        width: $social-media-button-size !important;
        height: $social-media-button-size !important;
      }
    }
  }

  footer {
    margin: 0;
    padding: 0;

    border: none;
  }
}

#embed-superlike-button {
  position: relative;

  display: flex;
  align-items: center;
  flex-direction: column;
  flex-grow: 1;

  width: 100%;
  min-width: unset;
  margin: 0;

  transition-property: background;
  text-align: center;
  letter-spacing: 0;

  border-radius: normalized(20);
  box-shadow: 0 normalized(2) normalized(6) 0 rgba(0, 0, 0, 0.25);

  font-size: normalized(20);
  line-height: normalized(20);

  &:active {
    box-sizing: border-box;

    color: $like-green;
    border: solid normalized(4) $like-green;
    background-color: $like-white;
  }

  &::before {
    border-radius: inherit;
  }

  :global(.md-ripple) {
    flex-grow: 1;

    min-height: 0;
    padding: 0;

    border-radius: inherit;
  }
}
</style>
