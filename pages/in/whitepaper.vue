<template>
  <div class="lc-container-1 lk-whitepaper-page">
    <div class="lc-container-2">
      <ul class="document-list lc-margin-top-64 lc-mobile">
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
  </div>
</template>


<script>
import Document from '~/components/whitepaper/Document';
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
  {
    languageKey: 'ja',
    src: '/in/likecoin-onepager-ja.pdf',
  },
  {
    languageKey: 'ko',
    src: '/in/likecoin-onepager-ko.pdf',
  },
  {
    languageKey: 'de',
    src: '/in/likecoin-onepager-de.pdf',
  },
  {
    languageKey: 'es',
    src: '/in/likecoin-onepager-es.pdf',
  },
  {
    languageKey: 'fr',
    src: '/in/likecoin-onepager-fr.pdf',
  },
  {
    languageKey: 'it',
    src: '/in/likecoin-onepager-it.pdf',
  },
  {
    languageKey: 'pt',
    src: '/in/likecoin-onepager-pt.pdf',
  },
  {
    languageKey: 'ru',
    src: '/in/likecoin-onepager-ru.pdf',
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
  components: {
    Document,
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
