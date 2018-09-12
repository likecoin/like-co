<template>
  <article-dialog
    :is-show.sync="isShowDialog"
    class="content-civics-dialog"
  >
    <!-- !! Pending for design -->
    <div>
      <div class="lc-dialog-container-1">
        <div class="lc-dialog-container-2">
          <h1 class="lc-font-size-32 lc-margin-bottom-8">
            Content Civics – Support your favourite content
          </h1>
          <div class="content-civics-dialog__content-wrapper lc-margin-top-32">
            <img :src="ContentIllustration">
          </div>
        </div>
      </div>

      <section class="content-civics-dialog__get-start-wrapper lc-margin-bottom-32">
        <div class="lc-dialog-container-1">
          <div class="lc-dialog-container-2 lc-padding-top-64 lc-padding-bottom-16">
            <div class="content-civics-dialog__content-wrapper">
              <p>
                By adding the LikeButton to your creative content,
                The quick, brown fox jumps over a lazy dog
                DJs flock by when MTV ax quiz prog.
                Junk MTV quiz graced by fox whelps.
              </p>

              <div class="lc-text-align-center lc-margin-top-20">
                <md-button
                  :to="{ name: 'in-settings-button' }"
                  class="md-likecoin outline"
                >Get started</md-button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="lc-margin-bottom-32">
        <div class="lc-dialog-container-1">
          <div class="lc-dialog-container-2 lc-padding-top-64 lc-padding-bottom-16">
            <div class="content-civics-dialog__content-wrapper">
              <p>
                By adding the LikeButton to your creative content,
                The quick, brown fox jumps over a lazy dog
                DJs flock by when MTV ax quiz prog.
                Junk MTV quiz graced by fox whelps.
              </p>

              <br><br>

              <p class="lc-color-like-dark-brown-2 lc-font-size-20 lc-font-weight-600">
                By adding the LikeButton to your creative content,
                The quick, brown fox jumps over a lazy dog
                DJs flock by when MTV ax quiz prog.
                Junk MTV quiz graced by fox whelps.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </article-dialog>
</template>


<script>
import ArticleDialog from '~/components/dialogs/ArticleDialog';

import ContentIllustration from '@/assets/home/wordpress-poc.gif';

export default {
  name: 'content-civics-dialog',
  components: {
    ArticleDialog,
  },
  props: {
    isShow: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      ContentIllustration,
      isShowDialog: false,
    };
  },
  watch: {
    isShow(v) {
      this.isShowDialog = v;
    },
    isShowDialog(v) {
      this.$emit('update:isShow', v);
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";
@import "~assets/mixin";

.content-civics-dialog {
  &__get-start-wrapper {
    margin-top: -40px;

    background-image: $like-linear-gradient;
  }

  &__content-wrapper {
    padding: 0 60px;

    color: $like-dark-brown-2;

    font-size: 20px;
    font-weight: 600;
    line-height: normal;

    @media (max-width: 600px) {
      padding: 0;

      font-size: 16px;
    }
  }
}
</style>
