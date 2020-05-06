<!-- eslint-disable max-len -->
<template>
  <div class="home-page v2">
    <section class="site-hero">
      <div
        data-collapse="medium"
        data-animation="default"
        data-duration="400"
        data-doc-height="1"
        data-no-scroll="1"
        role="banner"
        class="site-header w-nav"
      ><nuxt-link
         class="brand w-nav-brand"
         :to="{ name: 'index' }"
       ><img
         src="~/assets/webflow/images/LikeCoin_PressKit_Logo_Fullcolor_Light.svg"
         alt="LikeCoin"
         class="image"
       ></nuxt-link>
        <div class="div-block">
          <nav
            role="navigation"
            class="nav-menu w-nav-menu"
            :style="navMenuStyle"
          >
            <a
              href="https://docs.like.co/user-guide/faq"
              class="site-main-menu__item"
            >FAQ</a>
            <a
              href="#"
              class="site-main-menu__item"
            >Events</a>
            <a
              href="https://github.com/likecoin/likecoin"
              class="site-main-menu__item"
            >Develop</a>
            <a
              href="https://docs.like.co/"
              class="site-main-menu__item"
            >Learn</a>
            <ul
              role="list"
              class="social-media-icons w-list-unstyled"
            >
              <li>
                <a
                  href="https://join.g0v.tw/"
                  target="_blank"
                  class="icon-button-link icon-button-link--dark w-inline-block"
                >
                  <div class="icon-button w-embed"><svg
                    viewbox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <path d="m8.843 12.651c-1.392 0-2.521 1.129-2.521 2.521v6.306c0 1.392 1.129 2.521 2.521 2.521s2.521-1.129 2.521-2.521v-6.306c-.001-1.392-1.13-2.521-2.521-2.521z" />
                    <path d="m.019 15.172c0 1.393 1.13 2.523 2.523 2.523s2.523-1.13 2.523-2.523v-2.523h-2.521c-.001 0-.001 0-.002 0-1.393 0-2.523 1.13-2.523 2.523z" />
                    <path d="m8.846-.001c-.001 0-.002 0-.003 0-1.393 0-2.523 1.13-2.523 2.523s1.13 2.523 2.523 2.523h2.521c0-1.431 0-1.083 0-2.528-.001-1.391-1.128-2.518-2.518-2.518z" />
                    <path d="m2.525 11.37h6.318c1.393 0 2.523-1.13 2.523-2.523s-1.13-2.523-2.523-2.523h-6.318c-1.393 0-2.523 1.13-2.523 2.523s1.13 2.523 2.523 2.523z" />
                    <path d="m21.457 6.323c-1.391 0-2.518 1.127-2.518 2.518v.005 2.523h2.521c1.393 0 2.523-1.13 2.523-2.523s-1.13-2.523-2.523-2.523c-.001 0-.002 0-.003 0z" />
                    <path d="m12.641 2.522v6.325c0 1.392 1.129 2.521 2.521 2.521s2.521-1.129 2.521-2.521v-6.325c0-1.392-1.129-2.521-2.521-2.521-1.392 0-2.521 1.129-2.521 2.521z" />
                    <path d="m17.682 21.476c0-1.392-1.129-2.521-2.521-2.521h-2.521v2.523c.001 1.391 1.129 2.519 2.521 2.519s2.521-1.129 2.521-2.521z" />
                    <path d="m21.479 12.649h-6.318c-1.393 0-2.523 1.13-2.523 2.523s1.13 2.523 2.523 2.523h6.318c1.393 0 2.523-1.13 2.523-2.523s-1.13-2.523-2.523-2.523z" />
                  </svg></div>
                </a>
              </li>
              <li>
                <a
                  href="https://medium.com/likecoin/"
                  target="_blank"
                  class="icon-button-link icon-button-link--dark w-inline-block"
                >
                  <div class="icon-button w-embed"><svg
                    viewbox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <path d="m22.085 4.733 1.915-1.832v-.401h-6.634l-4.728 11.768-5.379-11.768h-6.956v.401l2.237 2.693c.218.199.332.49.303.783v10.583c.069.381-.055.773-.323 1.05l-2.52 3.054v.396h7.145v-.401l-2.52-3.049c-.273-.278-.402-.663-.347-1.05v-9.154l6.272 13.659h.729l5.393-13.659v10.881c0 .287 0 .346-.188.534l-1.94 1.877v.402h9.412v-.401l-1.87-1.831c-.164-.124-.249-.332-.214-.534v-13.467c-.035-.203.049-.411.213-.534z" />
                  </svg></div>
                </a>
              </li>
              <li>
                <a
                  href="http://github.com/likecoin"
                  target="_blank"
                  class="icon-button-link icon-button-link--dark w-inline-block"
                >
                  <div class="icon-button w-embed"><svg
                    viewbox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <path d="m12 .5c-6.63 0-12 5.28-12 11.792 0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.525 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .309.21.678.825.56 4.801-1.548 8.236-5.97 8.236-11.173 0-6.512-5.373-11.792-12-11.792z" />
                  </svg></div>
                </a>
              </li>
              <li>
                <a
                  href="http://telegram.me/likecoin"
                  target="_blank"
                  class="icon-button-link icon-button-link--dark w-inline-block"
                >
                  <div class="icon-button w-embed"><svg
                    viewbox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <path d="m9.417 15.181-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931l3.622-16.972.001-.001c.321-1.496-.541-2.081-1.527-1.714l-21.29 8.151c-1.453.564-1.431 1.374-.247 1.741l5.443 1.693 12.643-7.911c.595-.394 1.136-.176.691.218z" />
                  </svg></div>
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/Liker.Land/"
                  target="_blank"
                  class="icon-button-link icon-button-link--dark w-inline-block"
                >
                  <div class="icon-button w-embed"><svg
                    viewbox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <path d="m15.997 3.985h2.191v-3.816c-.378-.052-1.678-.169-3.192-.169-3.159 0-5.323 1.987-5.323 5.639v3.361h-3.486v4.266h3.486v10.734h4.274v-10.733h3.345l.531-4.266h-3.877v-2.939c.001-1.233.333-2.077 2.051-2.077z" />
                  </svg></div>
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/likecoin"
                  target="_blank"
                  class="icon-button-link icon-button-link--dark w-inline-block"
                >
                  <div class="icon-button w-embed"><svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24,4.56a10.38,10.38,0,0,1-2.84.78,4.94,4.94,0,0,0,2.17-2.72,10.14,10.14,0,0,1-3.12,1.19A4.92,4.92,0,0,0,11.7,7.17a5.07,5.07,0,0,0,.11,1.12A13.94,13.94,0,0,1,1.67,3.15,5,5,0,0,0,1,5.63,4.91,4.91,0,0,0,3.18,9.72,4.81,4.81,0,0,1,1,9.12v.05A5,5,0,0,0,4.9,14a5.36,5.36,0,0,1-1.29.16,4.13,4.13,0,0,1-.93-.09,5,5,0,0,0,4.6,3.43,9.9,9.9,0,0,1-6.1,2.1A9.12,9.12,0,0,1,0,19.54a13.81,13.81,0,0,0,7.55,2.21,13.91,13.91,0,0,0,14-14c0-.22,0-.43,0-.64A9.82,9.82,0,0,0,24,4.56Z" />
                  </svg></div>
                </a>
              </li>
            </ul>
          </nav><a
            href="https://github.com/sponsors/likecoin"
            class="button w-button"
            target="_blank"
          >Donate</a>
          <div
            class="menu-button w-nav-button"
            @click="onClickNavButton"
          >
            <div class="icon w-icon-nav-menu" />
          </div>
        </div>
      </div>
      <div class="site-hero-content">
        <div class="container container--fixed">
          <h1 class="tagline">A public blockchain for content <strong class="text--bold">monetization</strong>, <strong class="text--bold">attribution</strong> and <strong class="text--bold">distribution</strong>.<br></h1>
        </div>
      </div>
    </section>
    <div class="section">
      <div
        data-w-id="0f837ac9-4bf1-1302-9d48-8f9eaf91ba97"
        style="opacity:0"
        class="container container--fixed"
      >
        <div class="collage"><img
                               src="~/assets/webflow/images/likecoin-chain.png"
                               width="649"
                               srcset="~/assets/webflow/images/likecoin-chain-p-500.png 500w, ~/assets/webflow/images/likecoin-chain-p-800.png 800w, ~/assets/webflow/images/likecoin-chain-p-1080.png 1080w, ~/assets/webflow/images/likecoin-chain-p-1600.png 1600w, ~/assets/webflow/images/likecoin-chain-p-2000.png 2000w, ~/assets/webflow/images/likecoin-chain.png 2501w"
                               sizes="(max-width: 479px) 92vw, (max-width: 767px) 85vw, (max-width: 991px) 649px, 65vw"
                               alt=""
                               class="collage__image collage__image--left"
                             >
          <div class="collage__content">
            <div class="collage__content-inner">
              <h2 class="collage__title collage__title--light">LikeCoin chain</h2>
              <p class="paragraph">Launched in Nov 2019, LikeCoin chain operates under a permissionless, Bonded Proof-of-Stake (BPoS) mechanism. It is the infrastructure of the LikeCoin ecosystem. Explore LikeCoin chain in Big Dipper block explorer and read the documentations <a
                href="https://docs.like.co/developer/likecoin-chain-node"
                class="link--dark"
              >here</a>.</p><a
                href="https://likecoin.bigdipper.live"
                target="_blank"
                class="button button--dark w-button"
              >Chain Explorer - Big Dipper</a></div>
          </div>
        </div>
      </div>
    </div>
    <div class="section section--light section--what-we-do">
      <div class="container container--fixed">
        <h2 class="section__title section__title section__title--light">What we do</h2>
        <div class="w-layout-grid grid">
          <div class="grid-item">
            <h3 class="grid-item__title">Monetization</h3>
            <p class="grid-item__content">By simply attaching a LikeCoin button beneath your content, every Like by readers is turned into measurable reward without a paywall. The <a
              href="https://liker.land/civic"
              class="link--light"
            >Civic Liker</a> movement encourages readers to contribute USD5/mo to reward creativity and journalism, while the Matching Fund doubles the rewarding pool. In LikeCoin ecosystem, every Like counts.</p>
          </div>
          <div class="grid-item">
            <h3 class="grid-item__title">Attribution</h3>
            <p class="grid-item__content">In collaboration with the industry, we are drafting the <a
              href="https://github.com/likecoin/iscn-specs/issues"
              class="link--light"
            >international standard content number</a>, ISCN, which is a specification to use blockchain to immutably store metadata such as author, publisher, license terms and creation footprint. ISCN serves as a content registry in the Internet paradigm, much like ISBN served as a book database in the printing era. </p>
          </div>
          <div class="grid-item">
            <h3 class="grid-item__title">Distribution</h3>
            <p class="grid-item__content">With IPFS, LikeCoin protocol helps creators to reach wider audience in heavily censored environment. Apart from rewarding creators as a Liker, readers are encouraged to become Content Jockeys to help distribute creative stories and insightful analysis. Our unique distribution footprint mechanism rewards both creators and Content Jockeys, creating a win-win.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="section slogan">
      <div class="slogan-bg" />
      <div class="container container--fluid">
        <h2 class="slogan">Thrive to support content creators and publishers through the formation of a Decentralised Autonomous Organization (DAO).</h2>
      </div>
    </div>
    <div class="section section--dark section--use-case">
      <div class="container container--fixed">
        <h2 class="section__title section__title--dark">Use Case</h2>
        <p class="section__description">LikeCoin has been adopted to various use-cases, ranging from <strong class="text--bold">website plugins</strong>, <strong class="text--bold">mobile app</strong> to <strong class="text--bold">media platforms</strong>. As of April, 2020, the ecosystem of LikeCoin accumulated to <strong class="text--bold">60,300+ Likers</strong>, <strong class="text--bold">208,800+ contents</strong> by <strong class="text--bold">7,600+ creators</strong> on <strong class="text--bold">1000+ media</strong>. </p>
        <div class="w-layout-grid grid">
          <div class="grid-item">
            <div class="grid-item__image-wrapper"><img
              src="~/assets/webflow/images/app.png"
              srcset="~/assets/webflow/images/app-p-500.png 500w, ~/assets/webflow/images/app-p-1080.png 1080w, ~/assets/webflow/images/app.png 1200w"
              sizes="(max-width: 479px) 92vw, (max-width: 767px) 90vw, (max-width: 991px) 92vw, 93vw"
              alt=""
              class="grid-item__image"
            ></div>
            <h3 class="grid-item__title grid-item__title--center">Mobile App - Liker Land</h3>
            <p class="grid-item__content">Liker Land is a reader, passport, and wallet in one mobile app. It provides a friendly user interface for readers to discover, follow, and bookmark content. There are more than 223k+ content in LikerLand. It in-built with LikeCoin reward system, likers can reward content and manage their asset inside the app.</p>
          </div>
          <div class="grid-item">
            <div class="grid-item__image-wrapper"><img
              src="~/assets/webflow/images/likecoin-button.jpg"
              srcset="~/assets/webflow/images/likecoin-button-p-800.jpeg 800w, ~/assets/webflow/images/likecoin-button-p-1080.jpeg 1080w, ~/assets/webflow/images/likecoin-button.jpg 1200w"
              sizes="(max-width: 479px) 92vw, (max-width: 767px) 90vw, (max-width: 991px) 92vw, 93vw"
              alt=""
              class="grid-item__image"
            ></div>
            <h3 class="grid-item__title grid-item__title--center">Plugin - LikeCoin button</h3>
            <p class="grid-item__content">The trademarked LikeCoin button allows creators to install and attach to websites and blogs. The button is connected to the LikeCoin reward mechanism and turn each Like to an actual reward. It supports Wordpress, Medium and other blog platforms. </p>
          </div>
          <div class="grid-item">
            <div class="grid-item__image-wrapper"><img
              src="~/assets/webflow/images/media-matters.svg"
              alt="Matters"
              class="grid-item__image"
            ></div>
            <h3 class="grid-item__title grid-item__title--center">Media - Matters</h3>
            <p class="grid-item__content">Matters Lab is a decentralized content platform that provides a shared infrastructure to creators. Matters and LikeCoin developed it’s partnership since 2018, LikeCoin helps provide an open-source solution to build a decentralised independent journalist network. The partnership is a winning Innovation project of the <a href="https://newsinitiative.withgoogle.com/innovation-challenges/funding/">Google News Initiative 2020</a>. </p>
          </div>
          <div class="grid-item">
            <div class="grid-item__image-wrapper"><img
              src="~/assets/webflow/images/media-standnews.svg"
              alt="Stand News"
              class="grid-item__image"
            ></div>
            <h3 class="grid-item__title grid-item__title--center">Media - Stand News</h3>
            <p class="grid-item__content">Stand News is a free not-for-profit online news website based in Hong Kong. It primarily focuses on social and political issues in Hong Kong. It has a monthly 5.4M viewership. </p>
          </div>
          <div class="grid-item">
            <div class="grid-item__image-wrapper"><img
              src="~/assets/webflow/images/media-inmediahk.svg"
              alt="Hong Kong In-Media"
              class="grid-item__image"
            ></div>
            <h3 class="grid-item__title grid-item__title--center">Media - Hong Kong In-media</h3>
            <p class="grid-item__content">Hong Kong In-media is an independent online media platform in Hong Kong. It aims to provide an open public platform for the public and journalists, free from political intervention and commercial influence. It primary focus on local news and opinions. </p>
          </div>
          <div class="grid-item">
            <div class="grid-item__image-wrapper"><img
              src="~/assets/webflow/images/media-hkcnews.svg"
              alt="Hong Kong Citizen News"
              class="grid-item__image"
            ></div>
            <h3 class="grid-item__title grid-item__title--center">Media - Hong Kong Citizen News</h3>
            <p class="grid-item__content">Hong Kong Citizen News is a not-for-profit online news website. It primary focus on investigative and data-driven journalism to promote fair and neutral new content to the public. </p>
          </div>
          <div class="grid-item">
            <div class="grid-item__image-wrapper"><img
              src="~/assets/webflow/images/media-vocus.svg"
              alt="Vocus"
              class="grid-item__image"
            ></div>
            <h3 class="grid-item__title grid-item__title--center">Media - Vocus</h3>
            <p class="grid-item__content">Vocus us a new-style of content creation platform. It aims to provide a clean and simple reading space with no ads. It also supports multiple content payment mechanisms to readers. It attracts users from Chinese community such as Taiwan and Hong Kong. </p>
          </div>
          <div class="grid-item">
            <div class="grid-item__image-wrapper"><img
              src="~/assets/webflow/images/media-wordpress.svg"
              alt="WordPress"
              class="grid-item__image"
            ></div>
            <h3 class="grid-item__title grid-item__title--center">Plugin - WordPress</h3>
            <p class="grid-item__content">LikeCoin button was first released on Wordpress as a plugin in 2018. It allows creators to install and attach to websites and blogs. The button is connected to the LikeCoin reward mechanism and turn each Like to an actual reward. As of May 2020, it receive more than 1000+ installation.</p>
          </div>
          <div class="grid-item">
            <div class="grid-item__image-wrapper"><img
              src="~/assets/webflow/images/media-medium.svg"
              alt="Medium"
              class="grid-item__image"
            ></div>
            <h3 class="grid-item__title grid-item__title--center">Plugin - Medium</h3>
            <p class="grid-item__content">LikeCoin button supports Medium and various blog platforms. Content creators are able to embed LikeCoin button to their content once registered a Liker ID. </p>
          </div>
        </div>
        <div class="use-case__footer"><a
          href="https://join.g0v.tw/"
          class="button w-button"
          target="_blank"
        >How to join?</a></div>
      </div>
    </div>
    <div class="section section--light">
      <div class="container container--fixed">
        <div class="footer__content">
          <div>
            <img
              src="~/assets/webflow/images/LikeCoin_PressKit_Logo_Mono_Dark.svg"
              alt="LikeCoin"
              height="72"
              class="footer-logo"
            >
            <ul
              role="list"
              class="social-media-icons social-media-icons--footer w-list-unstyled"
            >
              <li>
                <a
                  href="https://join.g0v.tw/"
                  target="_blank"
                  class="icon-button-link icon-button-link--light w-inline-block"
                >
                  <div class="icon-button w-embed">
                    <svg
                      viewbox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                    >
                      <path d="m8.843 12.651c-1.392 0-2.521 1.129-2.521 2.521v6.306c0 1.392 1.129 2.521 2.521 2.521s2.521-1.129 2.521-2.521v-6.306c-.001-1.392-1.13-2.521-2.521-2.521z" />
                      <path d="m.019 15.172c0 1.393 1.13 2.523 2.523 2.523s2.523-1.13 2.523-2.523v-2.523h-2.521c-.001 0-.001 0-.002 0-1.393 0-2.523 1.13-2.523 2.523z" />
                      <path d="m8.846-.001c-.001 0-.002 0-.003 0-1.393 0-2.523 1.13-2.523 2.523s1.13 2.523 2.523 2.523h2.521c0-1.431 0-1.083 0-2.528-.001-1.391-1.128-2.518-2.518-2.518z" />
                      <path d="m2.525 11.37h6.318c1.393 0 2.523-1.13 2.523-2.523s-1.13-2.523-2.523-2.523h-6.318c-1.393 0-2.523 1.13-2.523 2.523s1.13 2.523 2.523 2.523z" />
                      <path d="m21.457 6.323c-1.391 0-2.518 1.127-2.518 2.518v.005 2.523h2.521c1.393 0 2.523-1.13 2.523-2.523s-1.13-2.523-2.523-2.523c-.001 0-.002 0-.003 0z" />
                      <path d="m12.641 2.522v6.325c0 1.392 1.129 2.521 2.521 2.521s2.521-1.129 2.521-2.521v-6.325c0-1.392-1.129-2.521-2.521-2.521-1.392 0-2.521 1.129-2.521 2.521z" />
                      <path d="m17.682 21.476c0-1.392-1.129-2.521-2.521-2.521h-2.521v2.523c.001 1.391 1.129 2.519 2.521 2.519s2.521-1.129 2.521-2.521z" />
                      <path d="m21.479 12.649h-6.318c-1.393 0-2.523 1.13-2.523 2.523s1.13 2.523 2.523 2.523h6.318c1.393 0 2.523-1.13 2.523-2.523s-1.13-2.523-2.523-2.523z" />
                    </svg>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="https://medium.com/likecoin/"
                  target="_blank"
                  class="icon-button-link icon-button-link--light w-inline-block"
                >
                  <div class="icon-button w-embed">
                    <svg
                      viewbox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                    >
                      <path d="m22.085 4.733 1.915-1.832v-.401h-6.634l-4.728 11.768-5.379-11.768h-6.956v.401l2.237 2.693c.218.199.332.49.303.783v10.583c.069.381-.055.773-.323 1.05l-2.52 3.054v.396h7.145v-.401l-2.52-3.049c-.273-.278-.402-.663-.347-1.05v-9.154l6.272 13.659h.729l5.393-13.659v10.881c0 .287 0 .346-.188.534l-1.94 1.877v.402h9.412v-.401l-1.87-1.831c-.164-.124-.249-.332-.214-.534v-13.467c-.035-.203.049-.411.213-.534z" />
                    </svg>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="http://github.com/likecoin"
                  target="_blank"
                  class="icon-button-link icon-button-link--light w-inline-block"
                >
                  <div class="icon-button w-embed">
                    <svg
                      viewbox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                    >
                      <path d="m12 .5c-6.63 0-12 5.28-12 11.792 0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.525 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .309.21.678.825.56 4.801-1.548 8.236-5.97 8.236-11.173 0-6.512-5.373-11.792-12-11.792z" />
                    </svg>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="http://telegram.me/likecoin"
                  target="_blank"
                  class="icon-button-link icon-button-link--light w-inline-block"
                >
                  <div class="icon-button w-embed">
                    <svg
                      viewbox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                    >
                      <path d="m9.417 15.181-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931l3.622-16.972.001-.001c.321-1.496-.541-2.081-1.527-1.714l-21.29 8.151c-1.453.564-1.431 1.374-.247 1.741l5.443 1.693 12.643-7.911c.595-.394 1.136-.176.691.218z" />
                    </svg>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/Liker.Land/"
                  target="_blank"
                  class="icon-button-link icon-button-link--light w-inline-block"
                >
                  <div class="icon-button w-embed">
                    <svg
                      viewbox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                    >
                      <path d="m15.997 3.985h2.191v-3.816c-.378-.052-1.678-.169-3.192-.169-3.159 0-5.323 1.987-5.323 5.639v3.361h-3.486v4.266h3.486v10.734h4.274v-10.733h3.345l.531-4.266h-3.877v-2.939c.001-1.233.333-2.077 2.051-2.077z" />
                    </svg>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/likecoin"
                  target="_blank"
                  class="icon-button-link icon-button-link--light w-inline-block"
                >
                  <div class="icon-button w-embed">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewbox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M24,4.56a10.38,10.38,0,0,1-2.84.78,4.94,4.94,0,0,0,2.17-2.72,10.14,10.14,0,0,1-3.12,1.19A4.92,4.92,0,0,0,11.7,7.17a5.07,5.07,0,0,0,.11,1.12A13.94,13.94,0,0,1,1.67,3.15,5,5,0,0,0,1,5.63,4.91,4.91,0,0,0,3.18,9.72,4.81,4.81,0,0,1,1,9.12v.05A5,5,0,0,0,4.9,14a5.36,5.36,0,0,1-1.29.16,4.13,4.13,0,0,1-.93-.09,5,5,0,0,0,4.6,3.43,9.9,9.9,0,0,1-6.1,2.1A9.12,9.12,0,0,1,0,19.54a13.81,13.81,0,0,0,7.55,2.21,13.91,13.91,0,0,0,14-14c0-.22,0-.43,0-.64A9.82,9.82,0,0,0,24,4.56Z" />
                    </svg>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  layout: 'webflow',
  asyncData({ query, redirect }) {
    if (query.press) {
      redirect(302, { name: 'in-about' }, query);
    }
  },
  data() {
    return {
      isShowNavMenu: false,
    };
  },
  computed: {
    navMenuStyle() {
      return this.isShowNavMenu ? {
        display: 'block',
        top: '100%',
        position: 'absolute',
        left: 0,
        right: 0,
      } : {};
    },
  },
  head() {
    return {
      title: `LikeCoin - ${this.$t('Home.Flag.title')}`,
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: `LikeCoin - ${this.$t('Home.Flag.title')}`,
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('Home.Flag.content'),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('Home.Flag.content'),
        },
        {
          hid: 'og_image',
          property: 'og:image',
          content: 'https://like.co/images/og/sale.png',
        },
      ],
    };
  },
  mounted() {
    if (window.fbq) window.fbq('track', 'ViewContent');
    /**
     * ----------------------------------------------------------------------
     * Webflow: Interactions 2.0: Init
     */
    // eslint-disable-next-line no-undef
    Webflow.require('ix2').init(
      {
        events: {
          'e-9': {
            id: 'e-9',
            eventTypeId: 'SCROLL_INTO_VIEW',
            action: {
              id: '', actionTypeId: 'SLIDE_EFFECT', config: { actionListId: 'slideInBottom', autoStopEventId: 'e-10' }, instant: false,
            },
            mediaQueries: ['main', 'medium', 'small', 'tiny'],
            target: { selector: '.grid-item', originalId: '5eb272b2dc812d6acba99d90|15458f6f-954b-d88e-5064-16caab82cf09', appliesTo: 'CLASS' },
            config: {
              loop: false, playInReverse: false, scrollOffsetValue: 10, scrollOffsetUnit: '%', delay: 0, direction: 'BOTTOM', effectIn: true,
            },
            createdOn: 1589251892706,
          },
          'e-23': {
            id: 'e-23',
            eventTypeId: 'SCROLL_INTO_VIEW',
            action: {
              id: '', actionTypeId: 'SLIDE_EFFECT', config: { actionListId: 'slideInBottom', autoStopEventId: 'e-24' }, instant: false,
            },
            mediaQueries: ['main', 'medium', 'small', 'tiny'],
            target: { appliesTo: 'ELEMENT', styleBlockIds: [], id: '5eb272b2dc812d6acba99d90|0f837ac9-4bf1-1302-9d48-8f9eaf91ba97' },
            config: {
              loop: false, playInReverse: false, scrollOffsetValue: 10, scrollOffsetUnit: '%', delay: 0, direction: 'BOTTOM', effectIn: true,
            },
            createdOn: 1589260299658,
          },
          'e-27': {
            id: 'e-27',
            eventTypeId: 'SCROLL_INTO_VIEW',
            action: {
              id: '', actionTypeId: 'FADE_EFFECT', config: { actionListId: 'fadeIn', autoStopEventId: 'e-28' }, instant: false,
            },
            mediaQueries: ['main', 'medium', 'small', 'tiny'],
            target: { selector: '.tagline', originalId: '5eb272b2dc812d6acba99d90|df42c89d-2155-6127-efb7-b0ec5ff8eeb9', appliesTo: 'CLASS' },
            config: {
              loop: false, playInReverse: false, scrollOffsetValue: 10, scrollOffsetUnit: '%', delay: 0, direction: null, effectIn: true,
            },
            createdOn: 1589262452762,
          },
          'e-29': {
            id: 'e-29',
            eventTypeId: 'SCROLL_INTO_VIEW',
            action: {
              id: '', actionTypeId: 'FADE_EFFECT', config: { actionListId: 'fadeIn', autoStopEventId: 'e-30' }, instant: false,
            },
            mediaQueries: ['main', 'medium', 'small', 'tiny'],
            target: { selector: '.container', originalId: '5eb272b2dc812d6acba99d90|0f837ac9-4bf1-1302-9d48-8f9eaf91ba97', appliesTo: 'CLASS' },
            config: {
              loop: false, playInReverse: false, scrollOffsetValue: 10, scrollOffsetUnit: '%', delay: 0, direction: null, effectIn: true,
            },
            createdOn: 1589262546286,
          },
        },
        actionLists: {
          slideInBottom: {
            id: 'slideInBottom',
            useFirstGroupAsInitialState: true,
            actionItemGroups: [{
              actionItems: [{
                actionTypeId: 'STYLE_OPACITY',
                config: {
                  delay: 0, duration: 0, target: { id: 'N/A', appliesTo: 'TRIGGER_ELEMENT', useEventTarget: true }, value: 0,
                },
              }],
            }, {
              actionItems: [{
                actionTypeId: 'TRANSFORM_MOVE',
                config: {
                  delay: 0, duration: 0, target: { id: 'N/A', appliesTo: 'TRIGGER_ELEMENT', useEventTarget: true }, xValue: 0, yValue: 100, xUnit: 'PX', yUnit: 'PX', zUnit: 'PX',
                },
              }],
            }, {
              actionItems: [{
                actionTypeId: 'TRANSFORM_MOVE',
                config: {
                  delay: 0, easing: 'outQuart', duration: 1000, target: { id: 'N/A', appliesTo: 'TRIGGER_ELEMENT', useEventTarget: true }, xValue: 0, yValue: 0, xUnit: 'PX', yUnit: 'PX', zUnit: 'PX',
                },
              }, {
                actionTypeId: 'STYLE_OPACITY',
                config: {
                  delay: 0, easing: 'outQuart', duration: 1000, target: { id: 'N/A', appliesTo: 'TRIGGER_ELEMENT', useEventTarget: true }, value: 1,
                },
              }],
            }],
          },
          fadeIn: {
            id: 'fadeIn',
            useFirstGroupAsInitialState: true,
            actionItemGroups: [{
              actionItems: [{
                actionTypeId: 'STYLE_OPACITY',
                config: {
                  delay: 0, duration: 0, target: { id: 'N/A', appliesTo: 'TRIGGER_ELEMENT', useEventTarget: true }, value: 0,
                },
              }],
            }, {
              actionItems: [{
                actionTypeId: 'STYLE_OPACITY',
                config: {
                  delay: 0, easing: 'outQuart', duration: 1000, target: { id: 'N/A', appliesTo: 'TRIGGER_ELEMENT', useEventTarget: true }, value: 1,
                },
              }],
            }],
          },
        },
        site: { mediaQueries: [{ key: 'main', min: 992, max: 10000 }, { key: 'medium', min: 768, max: 991 }, { key: 'small', min: 480, max: 767 }, { key: 'tiny', min: 0, max: 479 }] },
      },
    );
  },
  methods: {
    onClickNavButton() {
      this.isShowNavMenu = !this.isShowNavMenu;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/webflow/css/main.css";
</style>
