<!-- eslint-disable max-len -->
<template>
  <div
    v-if="mainStatus === 'registerISCN'"
    key="loading"
    class="likepay-body likepay-body--center"
  >
    <div class="wordpress-panel">
      <section class="likepay-panel__section-container">
        <header class="likepay-panel__section-header">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd" clip-rule="evenodd"
              :d="`
                M10.1963 3C10.7486 3 11.1963 3.44772 11.1963
                4V8.26795L14.8925 6.13397C15.3708 5.85783 15.9824
                6.02171 16.2585 6.5C16.5346 6.97829 16.3708 7.58988
                15.8925 7.86603L12.1963 10L15.8925 12.134C16.3708
                12.4101 16.5346 13.0217 16.2585 13.5C15.9824 13.9783
                15.3708 14.1422 14.8925 13.866L11.1963 11.7321V16C11.1963
                16.5523 10.7486 17 10.1963 17C9.64403 17 9.19632 16.5523
                9.19632 16V11.7321L5.50017 13.866C5.02187 14.1422 4.41028
                13.9783 4.13414 13.5C3.858 13.0217 4.02187 12.4101 4.50017
                12.134L8.19632 10L4.50017 7.86603C4.02187 7.58988 3.858
                6.97829 4.13414 6.5C4.41028 6.02171 5.02187 5.85783 5.50017
                6.13397L9.19632 8.26795V4C9.19632 3.44772 9.64403 3 10.1963 3Z`"
              fill="#28646E"
            />
          </svg>
          <div class="likepay-panel__header-title" style="margin-right: auto; color: #28646E; padding-left: 10px">{{ 'Sign  (2/2)' }}</div>
        </header>

        <div class="likepay-panel__section-meta">
          <div style="text-align: center">
            <h3 style="color: #9B9B9B;">Upload to Arweave succeeded. Please sign again to complete register ISCN.</h3>
          </div>
        </div>
        <div class="likepay-panel__section-meta">
          <div style="width: 32px; border: 2px solid #EBEBEB; background-color:#EBEBEB"> </div>
        </div>
        <div class="likepay-panel__section-meta" style="margin-top: 5px; display: flex; flex-direction: row;">
          <div class="likepay-panel__section-meta-label"> Fee </div>
          <div style="margin-left: 75px;"> {{ ISCNTotalFee }} LIKE </div>
        </div>
      </section>
      <section style="display: flex; flex-direction: row; padding: 10px 10px 30px 10px">
        <button
          style="
            color: #4A4A4A; border-radius: 12px; border: 2px solid #9B9B9B; margin: auto;
            padding: 10px 16px; background-color: white; cursor: pointer;"
          @click="submitTransfer"
        >
          Retry
        </button>
      </section>
    </div>
    <div style="display: flex; flex-direction: row; margin: 52px 0px; position: absolute; top: 590px">
      <div>
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.9207 12C23.9228 14.1626 23.2874 16.2778 22.094 18.0813C20.9006 19.8848 19.2018 21.2965 17.2105 22.1399C15.8514 22.7073 14.3934 22.9997 12.9207 23C11.858 22.9992 10.8007 22.8477 9.78052 22.55C7.50847 21.8733 5.51596 20.4807 4.09961 18.5796C2.68326 16.6785 1.919 14.3707 1.92066 12C1.92066 9.08262 3.07944 6.28458 5.14234 4.22168C7.20524 2.15878 10.0033 1 12.9207 1C15.838 1 18.6358 2.15878 20.6987 4.22168C22.7616 6.28458 23.9207 9.08262 23.9207 12V12Z" stroke="#50E3C2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12.9204 6.03003V14.03" stroke="#50E3C2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12.9204 19.97C13.7488 19.97 14.4204 19.2984 14.4204 18.47C14.4204 17.6415 13.7488 16.97 12.9204 16.97C12.092 16.97 11.4204 17.6415 11.4204 18.47C11.4204 19.2984 12.092 19.97 12.9204 19.97Z" fill="#50E3C2" />
        </svg>
      </div>
      <div style="margin: 0 10px">
        <svg width="101" height="20" viewBox="0 0 101 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M7.86458 3.33173C7.7668 3.33173 7.67559 3.30367 7.59854 3.25516H2.92065V17.7274H43.3203C43.0193 17.4933 42.7316 17.2397 42.4592 16.9673C40.7271 15.2352 39.754 12.8859 39.754 10.4363H40.7541L39.7541 10.4247C39.7825 7.99383 40.768 5.67218 42.4971 3.96331C42.7528 3.71063 43.0216 3.47435 43.3021 3.25516H34.5686C34.4915 3.30374 34.4002 3.33185 34.3024 3.33185C34.2045 3.33185 34.1132 3.30374 34.0361 3.25516H29.531C29.4539 3.30374 29.3626 3.33185 29.2647 3.33185C29.1669 3.33185 29.0756 3.30374 28.9985 3.25516H13.1683C13.0912 3.30367 13 3.33173 12.9022 3.33173C12.8044 3.33173 12.7132 3.30367 12.6362 3.25516H8.13062C8.05357 3.30367 7.96235 3.33173 7.86458 3.33173ZM56.828 19.7274C56.9428 19.7274 57.053 19.708 57.1556 19.6724H99.0793C99.6316 19.6724 100.079 19.2247 100.079 18.6724V2.29633C100.079 1.74405 99.6316 1.29633 99.0793 1.29633H57.1129C57.0226 1.26954 56.927 1.25516 56.828 1.25516H34.8024V0.772827C34.8024 0.496685 34.5785 0.272827 34.3024 0.272827H29.2647C28.9886 0.272827 28.7647 0.496685 28.7647 0.772827V1.25516H13.4022V0.772705C13.4022 0.496563 13.1784 0.272705 12.9022 0.272705H7.86458C7.58843 0.272705 7.36458 0.496563 7.36458 0.772705V1.25516H1.92065C1.36837 1.25516 0.920654 1.70287 0.920654 2.25516V18.7274C0.920654 19.2796 1.36837 19.7274 1.92065 19.7274H56.828ZM32.4631 13.9562C32.7393 13.9562 32.9631 13.7324 32.9631 13.4562V7.51275C32.9631 7.23661 32.7393 7.01275 32.4631 7.01275H9.14125C8.86511 7.01275 8.64125 7.23661 8.64125 7.51275V13.4562C8.64125 13.7324 8.86511 13.9562 9.14125 13.9562H32.4631ZM31.9631 8.01275V12.9562H9.64125V8.01275H31.9631ZM48.9901 3.29633C47.0855 3.2962 45.2576 4.04697 43.903 5.3858C42.5497 6.72326 41.7778 8.53983 41.754 10.4422C41.7556 12.3592 42.5178 14.1974 43.8734 15.553C45.2305 16.9101 47.071 17.6724 48.9901 17.6724H98.0793V3.29633H48.9901H48.9901ZM45.9211 10.4776C45.9211 8.57034 47.4672 7.02424 49.3745 7.02424C51.2817 7.02424 52.8278 8.57034 52.8278 10.4776C52.8278 12.3848 51.2817 13.9309 49.3745 13.9309C47.4672 13.9309 45.9211 12.3848 45.9211 10.4776ZM49.3745 6.02424C46.915 6.02424 44.9211 8.01806 44.9211 10.4776C44.9211 12.9371 46.915 14.9309 49.3745 14.9309C51.834 14.9309 53.8278 12.9371 53.8278 10.4776C53.8278 8.01806 51.834 6.02424 49.3745 6.02424Z" fill="#50E3C2" />
        </svg>
      </div>
      <div>
        <div>Do not connect to Ledger hardware wallets for signing.</div>
        <div>Ledger service temporarily unavailable.</div>
      </div>
    </div>
  </div>
  <div
    v-else-if="getIsSignFinishedState"
    key="loading"
    class="likepay-body likepay-body--center"
  >
    <div class="wordpress-panel">
      <section class="likepay-panel__section-container">
        <header class="likepay-panel__section-header">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd" clip-rule="evenodd"
              :d="`
                M10.1963 3C10.7486 3 11.1963 3.44772 11.1963
                4V8.26795L14.8925 6.13397C15.3708 5.85783 15.9824
                6.02171 16.2585 6.5C16.5346 6.97829 16.3708 7.58988
                15.8925 7.86603L12.1963 10L15.8925 12.134C16.3708
                12.4101 16.5346 13.0217 16.2585 13.5C15.9824 13.9783
                15.3708 14.1422 14.8925 13.866L11.1963 11.7321V16C11.1963
                16.5523 10.7486 17 10.1963 17C9.64403 17 9.19632 16.5523
                9.19632 16V11.7321L5.50017 13.866C5.02187 14.1422 4.41028
                13.9783 4.13414 13.5C3.858 13.0217 4.02187 12.4101 4.50017
                12.134L8.19632 10L4.50017 7.86603C4.02187 7.58988 3.858
                6.97829 4.13414 6.5C4.41028 6.02171 5.02187 5.85783 5.50017
                6.13397L9.19632 8.26795V4C9.19632 3.44772 9.64403 3 10.1963 3Z`"
              fill="#28646E"
            />
          </svg>
          <div class="likepay-panel__header-title" style="margin-right: auto; color: #28646E; padding-left: 10px">{{ 'Uploading...' }}</div>
        </header>
        <div class="likepay-panel__section-meta">
          <div style="text-align: center">
            <svg width="154" height="44" viewBox="0 0 154 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect y="14" width="154" height="16" rx="8" fill="#AAF1E7" />
              <rect x="14.0073" y="14" width="69.9079" height="16" rx="8" fill="#50E3C2" />
            </svg>
          </div>
          <div style="text-align: center"> <h3 style="color: #9B9B9B; margin: 0 -6px">Please do not close window. </h3></div>
        </div>
        <div class="likepay-panel__section-meta">
          <div style="width: 32px; border: 2px solid #EBEBEB; background-color:#EBEBEB"> </div>
        </div>
        <div class="likepay-panel__section-meta">
          <div style="font-size: 14px">
            <div>Depend on the file size, it may take several minutes. </div>
            <div>You will request to sign again before finish. </div>
          </div>
        </div>
      </section>
    </div>
  </div>
  <div
    v-else-if="mainStatus === 'onLIKEPay'"
    key="loading"
    class="likepay-body likepay-body--center"
  >
    <div class="wordpress-panel">
      <section class="likepay-panel__section-container">
        <header class="likepay-panel__section-header">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd" clip-rule="evenodd"
              :d="`
                M10.1963 3C10.7486 3 11.1963 3.44772 11.1963
                4V8.26795L14.8925 6.13397C15.3708 5.85783 15.9824
                6.02171 16.2585 6.5C16.5346 6.97829 16.3708 7.58988
                15.8925 7.86603L12.1963 10L15.8925 12.134C16.3708
                12.4101 16.5346 13.0217 16.2585 13.5C15.9824 13.9783
                15.3708 14.1422 14.8925 13.866L11.1963 11.7321V16C11.1963
                16.5523 10.7486 17 10.1963 17C9.64403 17 9.19632 16.5523
                9.19632 16V11.7321L5.50017 13.866C5.02187 14.1422 4.41028
                13.9783 4.13414 13.5C3.858 13.0217 4.02187 12.4101 4.50017
                12.134L8.19632 10L4.50017 7.86603C4.02187 7.58988 3.858
                6.97829 4.13414 6.5C4.41028 6.02171 5.02187 5.85783 5.50017
                6.13397L9.19632 8.26795V4C9.19632 3.44772 9.64403 3 10.1963 3Z`"
              fill="#28646E"
            />
          </svg>
          <div class="likepay-panel__header-title" style="margin-right: auto; color: #28646E; padding-left: 10px">{{ 'Sign  (1/2)' }}</div>
        </header>

        <div class="likepay-panel__section-meta">
          <div style="text-align: center"> <h3 style="color: #9B9B9B; margin: 0 -6px">Please sign with your wallet. </h3></div>
        </div>
        <div class="likepay-panel__section-meta">
          <div style="width: 32px; border: 2px solid #EBEBEB; background-color:#EBEBEB"> </div>
        </div>
        <div class="likepay-panel__section-meta" style="margin-top: 5px; display: flex; flex-direction: row;">
          <div class="likepay-panel__section-meta-label"> Fee </div>
          <div style="margin-left: 75px;"> {{ amounts[0] }} LIKE </div>
        </div>
      </section>
      <section style="display: flex; flex-direction: row; padding: 10px 10px 30px 10px">
        <button
          style="
            color: #4A4A4A; border-radius: 12px; border: 2px solid #9B9B9B; margin: auto;
            padding: 10px 16px; background-color: white; cursor: pointer;"
          @click="submitTransfer"
        >
          Retry
        </button>
      </section>
    </div>
    <div style="display: flex; flex-direction: row; margin: 52px 0px; position: absolute; top: 590px">
      <div>
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.9207 12C23.9228 14.1626 23.2874 16.2778 22.094 18.0813C20.9006 19.8848 19.2018 21.2965 17.2105 22.1399C15.8514 22.7073 14.3934 22.9997 12.9207 23C11.858 22.9992 10.8007 22.8477 9.78052 22.55C7.50847 21.8733 5.51596 20.4807 4.09961 18.5796C2.68326 16.6785 1.919 14.3707 1.92066 12C1.92066 9.08262 3.07944 6.28458 5.14234 4.22168C7.20524 2.15878 10.0033 1 12.9207 1C15.838 1 18.6358 2.15878 20.6987 4.22168C22.7616 6.28458 23.9207 9.08262 23.9207 12V12Z" stroke="#50E3C2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12.9204 6.03003V14.03" stroke="#50E3C2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12.9204 19.97C13.7488 19.97 14.4204 19.2984 14.4204 18.47C14.4204 17.6415 13.7488 16.97 12.9204 16.97C12.092 16.97 11.4204 17.6415 11.4204 18.47C11.4204 19.2984 12.092 19.97 12.9204 19.97Z" fill="#50E3C2" />
        </svg>
      </div>
      <div style="margin: 0 10px">
        <svg width="101" height="20" viewBox="0 0 101 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M7.86458 3.33173C7.7668 3.33173 7.67559 3.30367 7.59854 3.25516H2.92065V17.7274H43.3203C43.0193 17.4933 42.7316 17.2397 42.4592 16.9673C40.7271 15.2352 39.754 12.8859 39.754 10.4363H40.7541L39.7541 10.4247C39.7825 7.99383 40.768 5.67218 42.4971 3.96331C42.7528 3.71063 43.0216 3.47435 43.3021 3.25516H34.5686C34.4915 3.30374 34.4002 3.33185 34.3024 3.33185C34.2045 3.33185 34.1132 3.30374 34.0361 3.25516H29.531C29.4539 3.30374 29.3626 3.33185 29.2647 3.33185C29.1669 3.33185 29.0756 3.30374 28.9985 3.25516H13.1683C13.0912 3.30367 13 3.33173 12.9022 3.33173C12.8044 3.33173 12.7132 3.30367 12.6362 3.25516H8.13062C8.05357 3.30367 7.96235 3.33173 7.86458 3.33173ZM56.828 19.7274C56.9428 19.7274 57.053 19.708 57.1556 19.6724H99.0793C99.6316 19.6724 100.079 19.2247 100.079 18.6724V2.29633C100.079 1.74405 99.6316 1.29633 99.0793 1.29633H57.1129C57.0226 1.26954 56.927 1.25516 56.828 1.25516H34.8024V0.772827C34.8024 0.496685 34.5785 0.272827 34.3024 0.272827H29.2647C28.9886 0.272827 28.7647 0.496685 28.7647 0.772827V1.25516H13.4022V0.772705C13.4022 0.496563 13.1784 0.272705 12.9022 0.272705H7.86458C7.58843 0.272705 7.36458 0.496563 7.36458 0.772705V1.25516H1.92065C1.36837 1.25516 0.920654 1.70287 0.920654 2.25516V18.7274C0.920654 19.2796 1.36837 19.7274 1.92065 19.7274H56.828ZM32.4631 13.9562C32.7393 13.9562 32.9631 13.7324 32.9631 13.4562V7.51275C32.9631 7.23661 32.7393 7.01275 32.4631 7.01275H9.14125C8.86511 7.01275 8.64125 7.23661 8.64125 7.51275V13.4562C8.64125 13.7324 8.86511 13.9562 9.14125 13.9562H32.4631ZM31.9631 8.01275V12.9562H9.64125V8.01275H31.9631ZM48.9901 3.29633C47.0855 3.2962 45.2576 4.04697 43.903 5.3858C42.5497 6.72326 41.7778 8.53983 41.754 10.4422C41.7556 12.3592 42.5178 14.1974 43.8734 15.553C45.2305 16.9101 47.071 17.6724 48.9901 17.6724H98.0793V3.29633H48.9901H48.9901ZM45.9211 10.4776C45.9211 8.57034 47.4672 7.02424 49.3745 7.02424C51.2817 7.02424 52.8278 8.57034 52.8278 10.4776C52.8278 12.3848 51.2817 13.9309 49.3745 13.9309C47.4672 13.9309 45.9211 12.3848 45.9211 10.4776ZM49.3745 6.02424C46.915 6.02424 44.9211 8.01806 44.9211 10.4776C44.9211 12.9371 46.915 14.9309 49.3745 14.9309C51.834 14.9309 53.8278 12.9371 53.8278 10.4776C53.8278 8.01806 51.834 6.02424 49.3745 6.02424Z" fill="#50E3C2" />
        </svg>
      </div>
      <div>
        <div>Do not connect to Ledger hardware wallets for signing.</div>
        <div>Ledger service temporarily unavailable.</div>
      </div>
    </div>
  </div>
  <div
    v-else
    key="panel"
    class="likepay-body"
  >
    <div class="wordpress-panel">
      <section class="likepay-panel__section-container">
        <header class="likepay-panel__section-header">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd" clip-rule="evenodd"
              :d="`
                M10.1963 3C10.7486 3 11.1963 3.44772 11.1963
                4V8.26795L14.8925 6.13397C15.3708 5.85783 15.9824
                6.02171 16.2585 6.5C16.5346 6.97829 16.3708 7.58988
                15.8925 7.86603L12.1963 10L15.8925 12.134C16.3708
                12.4101 16.5346 13.0217 16.2585 13.5C15.9824 13.9783
                15.3708 14.1422 14.8925 13.866L11.1963 11.7321V16C11.1963
                16.5523 10.7486 17 10.1963 17C9.64403 17 9.19632 16.5523
                9.19632 16V11.7321L5.50017 13.866C5.02187 14.1422 4.41028
                13.9783 4.13414 13.5C3.858 13.0217 4.02187 12.4101 4.50017
                12.134L8.19632 10L4.50017 7.86603C4.02187 7.58988 3.858
                6.97829 4.13414 6.5C4.41028 6.02171 5.02187 5.85783 5.50017
                6.13397L9.19632 8.26795V4C9.19632 3.44772 9.64403 3 10.1963 3Z`"
              fill="#28646E"
            />
          </svg>
          <div class="likepay-panel__header-title" style="margin-right: auto; color: #28646E; padding-left: 10px">{{ 'Register ISCN' }}</div>
        </header>

        <div class="likepay-panel__section-meta">
          <div class="likepay-panel__section-meta-label"> ISCN Title </div>
          <div style="margin-top: 10px"> <p> {{ title }} </p> </div>
        </div>
        <div class="likepay-panel__section-meta">
          <div class="likepay-panel__section-meta-label"> Fee </div>
          <div style="margin-top: 10px"> <p> {{ amounts[0] }} LIKE </p> </div>
        </div>
      </section>
      <section style="display: flex; flex-direction: row; padding: 10px">
        <div style="margin: auto 0 auto auto; color: #9B9B9B;"> Fee: {{ amounts[0] }} LIKE </div>
        <button
          style="display: flex; flex-direction: row; background-color: #AAF1E7;
                 color: #28646E; border-radius: 12px; border: none; margin: 10px;
                 padding: 10px 15px; cursor: pointer"
          @click="onClickRedirectToKeplrSign"
        >
          <p style="margin: auto 10px auto auto; font-weight: 600;">Register</p>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.40006 12.8001C5.95823 12.4687 5.86869 11.8419 6.20006 11.4001L8.75006 8.00006L6.20006 4.60006C5.86869 4.15824 5.95823 3.53143 6.40006 3.20006C6.84189 2.86869 7.46869 2.95823 7.80006 3.40006L10.8001 7.40006C11.0667 7.75562 11.0667 8.24451 10.8001 8.60006L7.80006 12.6001C7.46869 13.0419 6.84189 13.1314 6.40006 12.8001Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </section>
    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import {
  IS_TESTNET, LIKER_LAND_URL, IS_CHAIN_UPGRADING,
} from '@/constant';
import {
  queryLikeCoinBalance as queryCosmosLikeCoinBalance,
  getTransferInfo as getCosmosTransferInfo,
  calculateGas as calculateCosmosGas,
} from '@/util/CosmosHelper';
import User from '@/util/User';
import {
  apiGetUserMinById,
} from '@/util/api/api';
import Keplr from '@/util/Keplr';
import { getISCNTransferInfo } from '@/util/cosmos/iscn/query';
// const API_POST_ARWEAVE_UPLOAD = '/arweave/upload';

const URL = require('url-parse');

export default {
  name: 'payment',
  layout: 'likepay',
  data() {
    return {
      LIKER_LAND_URL,
      toIds: [],
      toUsers: [],
      amounts: [],
      agentId: '',
      agentUser: null,
      agentFee: '',
      redirectUri: '',
      showDetails: false,
      blocking: false,
      state: '',
      gasFee: '',
      isUsingKeplr: false,
      mainStatus: 'initial',
      fingerprints: [],
      title: '',
      tags: [],
      url: '',
      license: '',
      memo: '',
      ISCNTotalFee: 0.00,
    };
  },
  async asyncData({
    query,
    error,
    redirect,
  }) {
    const {
      to: toString,
      amount: amountString,
      via: agentId,
      fee: agentFee,
      redirect_uri: redirectUri,
      blocking,
      state,
      opener,
      title,
    } = query;
    let {
      remarks = `LIKE pay${agentId ? ` via ${agentId}` : ''}`,
    } = query;
    if (!Object.keys(query).length) {
      return redirect('https://docs.like.co/developer/like-pay/web-widget/reference');
    }
    if (!toString) {
      return error({ statusCode: 400, message: 'INVALID_RECIPIENT' });
    }
    if (!amountString) {
      return error({ statusCode: 400, message: 'INVALID_AMOUNT' });
    }
    const toIds = toString.split(',');
    const amounts = amountString.split(',');
    if (toIds.length !== amounts.length) {
      return error({ statusCode: 400, message: 'RECIPIENT_AND_AMOUNT_SIZE_MISMATCH' });
    }
    if (!agentId && (agentFee)) {
      return error({ statusCode: 400, message: 'MISSING_VIA' });
    }

    if (remarks) {
      remarks = remarks.substring(0, 255);
    }

    let promises = [];
    promises.push(agentId ? apiGetUserMinById(agentId, { type: 'payment' }) : Promise.resolve(null));
    promises = promises.concat(toIds.map(id => apiGetUserMinById(id, { type: 'payment' })));

    return Promise.all(promises).then((res) => {
      const [agentRes, ...toRes] = res;
      let agentUser;
      if (agentRes) {
        agentUser = {
          ...agentRes.data,
          avatarHalo: User.getAvatarHaloType(agentRes.data),
        };
      }
      const toUsers = toRes.map((u) => {
        const {
          user,
          cosmosWallet,
          avatar,
          displayName,
          paymentRedirectWhiteList,
        } = u.data;
        return {
          user,
          cosmosWallet,
          avatar,
          displayName,
          avatarHalo: User.getAvatarHaloType(u.data),
          paymentRedirectWhiteList,
        };
      });
      if (agentUser && !agentUser.cosmosWallet) {
        error({ statusCode: 400, message: 'VIA_USER_HAS_NO_WALLET' });
      }

      if (toUsers.some(u => !u.cosmosWallet)) {
        error({ statusCode: 400, message: 'RECEIPIENT_HAS_NO_WALLET' });
      }

      let redirectWhitelistError = null;
      let isRedirectURLWhiteListed = false;
      if (redirectUri) {
        if (agentId) {
          const {
            paymentRedirectWhiteList: agentWhiteList = [],
          } = agentUser;
          if (!IS_TESTNET && (!agentWhiteList || !agentWhiteList.length)) {
            redirectWhitelistError = redirectWhitelistError || { statusCode: 400, message: 'AGENT_NOT_SETUP_PAYMENT_REDIRECT' };
          }
          if (agentWhiteList.length && !agentWhiteList.includes(redirectUri)) {
            redirectWhitelistError = redirectWhitelistError || { statusCode: 400, message: 'REDIRECT_URI_NOT_WHITELIST' };
          }
        } else {
          if (toUsers.length > 1) {
            redirectWhitelistError = redirectWhitelistError || { statusCode: 400, message: 'CANNOT_REDIRECT_MULTIPLE_RECEIPIENTS' };
          }
          const {
            paymentRedirectWhiteList: userWhiteList = [],
          } = toUsers[0];
          if (!IS_TESTNET && (!userWhiteList || !userWhiteList.length)) {
            redirectWhitelistError = redirectWhitelistError || { statusCode: 400, message: 'USER_NOT_SETUP_PAYMENT_REDIRECT' };
          }
          if (userWhiteList.length && !userWhiteList.includes(redirectUri)) {
            redirectWhitelistError = redirectWhitelistError || { statusCode: 400, message: 'REDIRECT_URI_NOT_WHITELIST' };
          }
        }
        isRedirectURLWhiteListed = !redirectWhitelistError;
      }
      const hasOpener = opener && opener !== '0';
      const shouldThrowRedirectWhitelistError = redirectUri && !hasOpener;
      if (redirectWhitelistError && shouldThrowRedirectWhitelistError) {
        error(redirectWhitelistError);
      }

      return {
        toIds,
        amounts,
        toUsers,
        agentId,
        agentUser,
        agentFee,
        redirectUri,
        remarks,
        blocking,
        state,
        opener: hasOpener,
        isRedirectURLWhiteListed,
        title,
      };
    }).catch((e) => {
      console.error(e);
      error({ statusCode: 404, message: e.message });
    });
  },
  head() {
    return {
      title: 'LIKE pay',
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
      'getLikeCoinUsdNumericPrice',
      'getUserInfo',
      'getAuthCoreNeedReAuth',
      'getIsShowingTxPopup',
      'getPendingTxInfo',
      'getIsSignFinishedState',
    ]),
    redirectOrigin() {
      console.log('this.redirectUri: ', this.redirectUri);
      const url = new URL(this.redirectUri, true);
      console.log('url: ', url);
      return url.origin;
    },
    windowOpener() {
      if (!window) return null;
      return window.opener;
    },
    isChainUpgrading() {
      return IS_CHAIN_UPGRADING;
    },
    httpReferrer() {
      return this.$route.query.referrer || document.referrer || undefined;
    },
    sumOfToAmount() {
      if (!this.amounts) return '0';
      const amount = this.amounts.reduce(
        (acc, a) => acc.plus(a),
        new BigNumber(0),
      );
      return amount.toFixed();
    },
    actualSendAmount() {
      let amount = new BigNumber(this.sumOfToAmount);
      if (this.agentUser && this.agentFee) {
        amount = amount.plus(this.agentFee);
      }
      return amount.toFixed();
    },
    totalAmount() {
      let amount = new BigNumber(this.actualSendAmount);
      if (this.gasFee) amount = amount.plus(this.gasFee);
      return amount.toFixed();
    },
    isMultiSend() {
      return this.toIds.length > 1 || this.hasAgentFee;
    },
    hasAgentFee() {
      return this.agentUser && this.agentFee && this.agentFee !== '0';
    },
    usdTransferStrValue() {
      if (this.getLikeCoinUsdNumericPrice && this.totalAmount) {
        const value = new BigNumber(this.totalAmount);
        const usdValue = value.times(this.getLikeCoinUsdNumericPrice);
        let decimalPlace = 2;
        if (usdValue.lt(0.01)) decimalPlace = 4;
        return value.times(this.getLikeCoinUsdNumericPrice).toFixed(decimalPlace);
      }
      return null;
    },
    likePayMetadata() {
      const {
        toIds,
        amounts,
        agentId,
        agentFee,
        redirectUri,
        remarks,
        blocking,
        state,
      } = this;
      return {
        likePay: {
          toIds,
          amounts,
          agentId,
          agentFee,
          redirectUri,
          remarks,
          blocking,
          state,
        },
      };
    },
  },
  async mounted() {
    const {
      fingerprints,
      title,
      tags,
      type,
      license,
      url,
    } = this;
    const { cosmosWallet } = this.getUserInfo;
    if (!this.isChainUpgrading) {
      this.calculateGasFee();
    }
    if (!this.getLikeCoinUsdNumericPrice) {
      await this.queryLikeCoinUsdPrice();
    }
    if (this.opener && !window.opener) {
      this.$nuxt.error({ statusCode: 400, message: 'Cannot access window opener' });
    }
    this.ISCNTotalFee = await this.calculateISCNTxTotalFee({
      userId: this.getUserId,
      displayName: this.getUserInfo.displayName,
      cosmosWallet,
      fingerprints,
      name: title,
      tags,
      type,
      license,
      url,
    });
  },
  methods: {
    ...mapActions([
      'popupAuthDialogInPlace',
      'setReAuthDialogShow',
      'sendCosmosPayment',
      'setErrorMsg',
      'queryLikeCoinUsdPrice',
      'fetchCurrentCosmosWallet',
      'prepareCosmosTxSigner',
      'setDefaultCosmosWalletSource',
      'calculateISCNTxTotalFee',
      'sendISCNSignature',
    ]),
    toggleDetails() {
      const isCollapsing = !this.showDetails;
      const tl = new this.$gsap.TimelineMax({
        onComplete: () => {
          this.showDetails = !this.showDetails;
        },
      });
      tl.to(this.$refs.dropdownBody, 0.5, {
        height: isCollapsing ? 0 : this.$refs.dropdownBody.scrollHeight,
        ease: 'easeOutPower4',
        clearProps: isCollapsing ? '' : 'height',
      }, 0);
      tl.to(this.$refs.dropdownArrow, 0.2, {
        rotationZ: isCollapsing ? 0 : 180,
        ease: 'easeOutPower4',
      }, 0);
    },
    maskedWallet(wallet) {
      return wallet.replace(/((?:cosmos1|0x).{4}).*(.{10})/, '$1...$2');
    },
    async calculateGasFee() {
      let feeAmount;
      if (this.isMultiSend) {
        const tos = this.toUsers.map(u => u.cosmosWallet);
        const values = [...this.amounts];
        if (this.hasAgentFee) {
          tos.push(this.agentUser.cosmosWallet);
          values.push(this.agentFee);
        }
        ({ feeAmount } = await calculateCosmosGas(tos));
      } else {
        ({ feeAmount } = await calculateCosmosGas(this.toUsers));
      }
      this.gasFee = BigNumber(feeAmount[0].amount).dividedBy(1e9).toFixed();
      return this.gasFee;
    },
    async checkFullyLoad() {
      if (this.currentTab === 'loaded') {
        console.log('this.redirectOrigin: ', this.redirectUri);
        window.opener.postMessage('openedReady', 'http://localhost:8080'); // TODO: solve redirectOrigin null issue
      }
    },
    async onArweaveUploadSuccessMessage(event) {
      console.log('onArweaveUploadSuccessMessage...event: ', event);
      const { action, data } = JSON.parse(event.data);
      console.log('-action: ', action);
      if (action === 'REGISTER_ISCN') {
        console.log('start REGISTER_ISCN data: ', data);
        this.mainStatus = 'registerISCN';
        const {
          fingerprints, tags, url, type, license,
        } = data;
        this.fingerprints = fingerprints;
        this.tags = tags;
        this.url = url;
        this.type = type;
        this.license = license;
        await this.submitISCNTransfer();
      }
    },
    async submitISCNTransfer() {
      console.log('submitISCNTransfer...');
      // try {
      const from = await this.fetchCurrentCosmosWallet();
      if (!from) {
        throw new Error('PLEASE_RELOGIN');
      }
      if (!this.isUsingKeplr) {
        const { cosmosWallet } = this.getUserInfo;
        const userWallet = cosmosWallet;
        if (userWallet !== undefined && from !== userWallet) {
          this.setErrorMsg(this.$t('Transaction.error.authcoreWalletNotMatch'));
          throw new Error('VALIDATION_FAIL');
        }
      }
      const signer = await this.prepareCosmosTxSigner();
      const {
        fingerprints,
        title,
        tags,
        type,
        license,
        url,
      } = this;
      console.log('fingerprints: ', fingerprints);
      console.log('title: ', title);
      console.log('type: ', type);
      console.log('license: ', license);
      console.log('tags: ', tags);
      console.log('url: ', url);
      const txHash = await this.sendISCNSignature({
        cosmosWallet: from,
        userId: this.getUserId || '',
        displayName: this.getUserInfo.displayName || '',
        fingerprints,
        name: title,
        tags,
        type,
        license,
        url,
        signer,
        isWordPressSideBar: true,
      });
      console.log('ISCN txHash: ', txHash);
      await this.postISCNTransaction({ txHash });
      // } catch (error) {
      //   if (error.message !== 'VALIDATION_FAIL') console.error(error);
      // }
    },
    async postISCNTransaction({ txHash, error } = {}) {
      console.log('postISCNTransaction...');
      if (this.opener || this.redirectUri) {
        const ISCNTransferInfo = await getISCNTransferInfo(txHash, { blocking: true });
        const { isFailed, iscnId } = ISCNTransferInfo;
        const success = !isFailed;
        const { state } = this;
        const payload = {};
        if (txHash) payload.tx_hash = txHash;
        if (iscnId) payload.iscnId = iscnId;
        if (error) payload.error = error;
        if (state) payload.state = state;
        if (success !== undefined) payload.success = success;
        if (this.opener) {
          const message = JSON.stringify({
            action: 'ISCN_SUBMITTED',
            data: payload,
          });
          this.windowOpener.postMessage(message, this.redirectOrigin);
          const iscnIdString = encodeURIComponent(iscnId);
          window.location.href = `https://app.rinkeby.like.co/view/${iscnIdString}`;
        }
      }
    },
    async onClickRedirectToKeplrSign() {
      const res = await Keplr.initKeplr();
      if (!res) {
        throw new Error('FAILED_CONNECT_TO_KEPLR');
      }
      this.setDefaultCosmosWalletSource({ source: 'keplr', persistent: false });
      this.isUsingKeplr = true;
      console.log('start listening...this.redirectOrigin: ', this.redirectOrigin);

      // pay LIKE Pay
      this.mainStatus = 'onLIKEPay';
      await this.submitTransfer();
    },
    async submitTransfer() {
      if (this.isChainUpgrading) return;
      try {
        const { cosmosWallet } = this.getUserInfo;
        const amount = new BigNumber(this.totalAmount);
        const from = await this.fetchCurrentCosmosWallet();
        if (!from) {
          throw new Error('PLEASE_RELOGIN');
        }
        const userWallet = cosmosWallet;
        if (userWallet !== undefined && from !== userWallet && !this.isUsingKeplr) {
          this.setErrorMsg(this.$t('Transaction.error.authcoreWalletNotMatch'));
          throw new Error('VALIDATION_FAIL');
        }
        const to = this.toUsers[0].cosmosWallet;
        if (from === to) {
          this.setErrorMsg(this.$t('Transaction.error.sameUser'));
          throw new Error('VALIDATION_FAIL');
        }
        const balance = await queryCosmosLikeCoinBalance(from);
        if (amount.gt(balance)) {
          this.setErrorMsg(
            this.$t('Transaction.error.likecoinInsufficient'),
          );
          throw new Error('VALIDATION_FAIL');
        }
        const signer = await this.prepareCosmosTxSigner();
        const isWait = !!this.blocking;
        const metadata = this.likePayMetadata;
        if (this.actualSendAmount === 0 || this.actualSendAmount === '0') {
          this.mainStatus = 'registerISCN';
          console.log('start to listen onArweaveUploadSuccessMessage...');
          const message = JSON.stringify({
            action: 'TX_SUBMITTED',
            data: { skipUploadArweave: true },
          });
          window.opener.postMessage(message, this.redirectOrigin);
          window.addEventListener(
            'message',
            this.onArweaveUploadSuccessMessage,
            false,
          );
          // await this.submitISCNTransfer();
          return;
        }
        const txHash = await this.sendCosmosPayment({
          signer,
          from,
          to,
          value: this.actualSendAmount,
          memo: this.remarks,
          showDialogAction: false,
          isWait,
          metadata,
          isWordPressSideBar: true,
        });
        this.mainStatus = 'uploadArweave';
        this.postTransaction({ txHash });
      } catch (error) {
        if (error.message !== 'VALIDATION_FAIL') console.error(error);
      }
    },
    async postTransaction({ txHash, error } = {}) {
      if (this.redirectUri) {
        let success;
        if (this.blocking) {
          const { isFailed } = await getCosmosTransferInfo(txHash, { blocking: true });
          success = !isFailed;
        }
        const { state, remarks } = this;
        if (this.opener) {
          const payload = {};
          if (txHash) payload.tx_hash = txHash;
          if (error) payload.error = error;
          if (state) payload.state = state;
          if (remarks) payload.remarks = remarks;
          if (success !== undefined) payload.success = success;
          const message = JSON.stringify({
            action: 'TX_SUBMITTED',
            data: payload,
          });
          window.opener.postMessage(message, this.redirectOrigin);
          window.addEventListener(
            'message',
            this.onArweaveUploadSuccessMessage,
            false,
          );
        } else if (this.isRedirectURLWhiteListed) {
          const url = new URL(this.redirectUri, true);
          if (txHash) url.query.tx_hash = txHash;
          if (error) url.query.error = error;
          if (state) url.query.state = state;
          if (remarks) url.query.remarks = remarks;
          if (success !== undefined) url.query.success = success;
          url.set('query', url.query);
          window.location.href = url.toString();
        }
      }
    },
    onClickSignInButton() {
      this.popupAuthDialogInPlace({ route: this.$route, isSignIn: true });
    },
    async onClickConnectKeplrButton() {
      const res = await Keplr.initKeplr();
      if (!res) {
        throw new Error('FAILED_CONNECT_TO_KEPLR');
      }
      this.setDefaultCosmosWalletSource({ source: 'keplr', persistent: false });
      this.isUsingKeplr = true;
      await this.$router.push({
        name: 'in-widget-keplr',
        query: {
          to: 'like-arweave', amount: '1', remarks: 'lala', opener: 1, redirect_url: 'localhost:8080',
        },
      });
    },
    onClickAuthCoreReAuth() {
      this.setReAuthDialogShow(true);
    },
  },
};
</script>
