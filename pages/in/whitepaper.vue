<template>
  <div class="lc-container-1 lk-whitepaper-page">
    <div class="lc-container-2">
      <ul class="document-list">
        <li
          v-for="(doc, index) in documents"
          :key="index">
          <document
            :imageSrc="doc.imageSrc"
            :linkSrc="doc.linkSrc"
            :title="$t(doc.title)" />
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
import Document from '~/components/whitepaper/Document';

import onePagerIcon from '~/assets/whitepaper/one-pager.svg';
import whitePaperIcon from '~/assets/whitepaper/whitepaper.svg';


const onePagerSrc = [
  {
    languageKey: 'en',
    src: '/in/likecoin-onepager-en.pdf',
  },
];
const whitePaperSrc = [
  {
    languageKey: 'en',
    src: '/in/likecoin-whitepaper-en.pdf',
  },
];

const documents = [
  {
    imageSrc: onePagerIcon,
    linkSrc: onePagerSrc,
    title: 'Whitepaper.Button.onepager',
  },
  {
    imageSrc: whitePaperIcon,
    linkSrc: whitePaperSrc,
    title: 'Whitepaper.Button.whitepaper',
  },
];

export default {
  name: 'WhitePaper',
  layout: 'defaultWithHeader',
  components: {
    Document,
  },
  data() {
    return {
      documents,
    };
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/index";
@import "~assets/default";

.document-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;

  margin-top: 70px;

  list-style: none;

  > li {
    flex: 1;

    &:not(:first-child) {
      margin-left: 16px;
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;

    li {
      margin: 24px !important;
    }
  }
}
</style>
