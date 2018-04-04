<template>
  <div class="lc-container-1 lk-whitepaper-page">
    <div class="lc-container-2">
      <ul class="document-list">
        <li
          v-for="(doc, index) in documents"
          :key="index">
          <document @click="logEvent(doc.type)"
            :imageSrc="doc.imageSrc"
            :linkSrc="doc.linkSrc"
            :title="$t(doc.title)"
            :mainLocales="doc.mainLocales" />
        </li>
      </ul>
    </div>

    <tool-bars :disableError="['web3', 'testnet', 'locked']" />
  </div>
</template>


<script>
import Document from '~/components/whitepaper/Document';
import ToolBars from '~/components/toolbars/ToolBars';

import { logTrackerEvent } from '@/util/EventLogger';

import onePagerIcon from '~/assets/whitepaper/one-pager.svg';
import whitePaperIcon from '~/assets/whitepaper/whitepaper.svg';


const onePagerSrc = [
  {
    languageKey: 'en',
    src: '/in/likecoin-onepager-en.pdf',
  },
  {
    languageKey: 'zh',
    src: '/in/likecoin-onepager-zh.pdf',
  },
  {
    languageKey: 'cn',
    src: '/in/likecoin-onepager-cn.pdf',
  },
];
const whitePaperSrc = [
  {
    languageKey: 'en',
    src: '/in/likecoin-whitepaper-en.pdf',
  },
  {
    languageKey: 'zh',
    src: '/in/likecoin-whitepaper-zh.pdf',
  },
  {
    languageKey: 'cn',
    src: '/in/likecoin-whitepaper-cn.pdf',
  },
];

const documents = [
  {
    imageSrc: onePagerIcon,
    linkSrc: onePagerSrc,
    title: 'Whitepaper.Button.onepager',
    type: 'onepager',
    mainLocales: ['en'],
  },
  {
    imageSrc: whitePaperIcon,
    linkSrc: whitePaperSrc,
    title: 'Whitepaper.Button.whitepaper',
    type: 'whitepaper',
    mainLocales: ['en'],
  },
];

export default {
  name: 'WhitePaper',
  layout: 'defaultWithHeader',
  components: {
    Document,
    ToolBars,
  },
  data() {
    return {
      documents,
    };
  },
  methods: {
    logEvent(type) {
      const isOnepager = (type === 'onpager');
      logTrackerEvent(
        this,
        'Behavior',
        isOnepager ? 'ViewOnePager' : 'ViewWhitePaper',
        isOnepager ? 'view one pager' : 'view white paper',
        1,
      );
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";
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
