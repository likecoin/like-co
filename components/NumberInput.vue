<template>
  <div>
    <md-field :class="['lc-number-input', { 'has-currency': !!this.currencyTitle }]">
      <label v-html="label" />
      <div class="lc-number-input-wrapper">
        <md-button class="value-button" @click="onAmountAdd(-1)">
          <img :src="MinusIcon" />
        </md-button>
        <span class="currency-title" v-if="!!currencyTitle">
          {{ currencyTitle }}
        </span>

        <md-input
          :class="['payment-input', { 'with-currency': !!currencyTitle }]"
          pattern="[0-9]*(\.[0-9]*)?"
          :title="$t('Transaction.label.enterValidNumber')"
          :value="amount"
          @keypress="onAmountKeypress"
          @input="onAmountInput"
          @focusout="formatAmount"
          required />

        <md-button class="value-button" @click="onAmountAdd(1)">
          <img :src="AddIcon" />
        </md-button>
      </div>
    </md-field>
    <span v-if="isBadAmount" class="error">
      {{ badText }}
    </span>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';

import AddIcon from '@/assets/icons/add.svg';
import MinusIcon from '@/assets/icons/minus.svg';

function formatAmount(amount) {
  let result = amount.toString().replace(/[^0-9.]/, '');
  if (!result) {
    result = '0.00';
  }
  const dotIndex = result.indexOf('.');
  if (dotIndex === -1) {
    result = `${result}.00`;
  } else if (dotIndex === 0) {
    result = `0${result}`;
  }
  const decimals = result.length - result.indexOf('.') - 1;
  if (decimals < 2) {
    const paddingZeros = '00'.substr(0, 2 - decimals);
    result = `${result}${paddingZeros}`;
  }
  return result;
}

export default {
  name: 'number-input',
  props: ['amount', 'label', 'currencyTitle', 'isBadAmount', 'badAmountMessage', 'decimalPlaceLimit'],
  data() {
    return {
      AddIcon,
      MinusIcon,
    };
  },
  computed: {
    badText() {
      return this.badAmountMessage || this.$t('Transaction.label.invalidAmount');
    },
  },
  methods: {
    onAmountAdd(diff) {
      let newAmount = new BigNumber(this.amount).plus(diff);
      if (newAmount.lt(0)) {
        newAmount = new BigNumber(0);
      }
      this.emitChange(formatAmount(newAmount.toFixed()));
    },
    onAmountKeypress(e) {
      if (e.code === 'Enter') {
        return;
      }
      if (!/[0-9.]/.test(e.key)) {
        e.preventDefault();
        return;
      }
      const { value } = e.target;
      const newValue =
        value.slice(0, e.target.selectionStart) + e.key + value.slice(e.target.selectionEnd);
      const isInvalidDecimals = (
        Number.isInteger(this.decimalPlaceLimit) && // is valid decimal place limit
        newValue.indexOf('.') >= 0 && // is decimal number
        newValue.split('.')[1].length > this.decimalPlaceLimit // decimal place is larger than limit
      );
      if (!/^[0-9]*.?[0-9]*$/.test(newValue) || isInvalidDecimals) {
        e.preventDefault();
        return;
      }
      this.emitChange(value);
    },
    onAmountInput(value) {
      this.emitChange(value);
    },
    formatAmount() {
      this.emitChange(formatAmount(this.amount));
    },
    emitChange(value) {
      this.$emit('onChange', value);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/index";

.lc-number-input {
  label {
    color: $like-dark-brown-1 !important;

    font-size: 14px;
    line-height: 18px;

    &::after {
      display: none;
    }
  }

  .lc-number-input-wrapper {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;

    width: 100%;
    margin-top: 12px;

    .currency-title {
      position: absolute;
      left: 42px;

      margin: 0 16px;

      color: $like-gray-5;
      font-size: 16px;
      font-weight: 300;

      @media (max-width: 600px) {
        margin-left: 4px;
        margin-right: 4px;
      }
    }

    .value-button {
      width: 48px;
      min-width: 48px;
      height: 48px;
      margin: 0;

      border-radius: 50%;

      @media (max-width: 600px) {
        width: 32px;
        min-width: 32px;
        height: 32px;
      }
    }

    .payment-input {
      width: 0; /* not sure why */
      height: 100%;
      line-height: 76px;
      padding: 0 12px;

      text-align: center;

      font-size: 56px;
      font-weight: 300;

      -webkit-text-fill-color: $like-gray-5;

      &.with-currency {
        padding-left: 48px;
        padding-right: 48px;

        @media (max-width: 600px) {
          padding-left: 32px;
          padding-right: 32px;
        }
      }

      @media (max-width: 600px) {
        font-size: 32px;
      }
    }
  }
}

.error {
  color: $like-red;
}
</style>
