<template>
  <div>
    <div class="qrcode-panel">
      <div class="qrcode-panel__instruction">
        <ol>
          <i18n
            path="WalletConnectQRCodeModal_Instruction_Step_1"
            tag="li"
          >
            <img
              class="qrcode-panel__app-icon"
              src="~assets/icons/liker-land-app.svg"
              alt="Liker Land App"
              place="appLogo"
            >
            <span
              class="qrcode-panel__app-name"
              place="appName"
            >Liker Land app</span>
          </i18n>
          <i18n
            path="WalletConnectQRCodeModal_Instruction_Step_2"
            tag="li"
          >
            <img
              class="qrcode-panel__qrcode-icon"
              src="~assets/icons/liker-land-app-qrcode.svg"
              alt="QR Code"
              place="qrcodeIcon"
            >
          </i18n>
          <li>
            {{ $t('WalletConnectQRCodeModal_Instruction_Step_3') }}
          </li>
        </ol>
      </div>
      <div class="qrcode-panel__qrcode-container">
        <div ref="qrcode" />
        <img
          class="qrcode-panel__qrcode-frame"
          src="~assets/auth-panel/wallet-connect-qrcode-frame.svg"
          alt=""
        >
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'easyqrcodejs';

export default {
  name: 'wallet-connect-qrcode-view',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  watch: {
    value() {
      this.makeQRCode();
    },
  },
  mounted() {
    this.makeQRCode();
  },
  methods: {
    makeQRCode() {
      if (!this.qrcode) {
        const width = 152;
        this.qrcode = new QRCode(this.$refs.qrcode, {
          text: this.value,
          width,
          height: width,
          colorDark: '#000',
          colorLight: 'transparent',
          drawer: 'svg',
          correctLevel: QRCode.CorrectLevel.H,
        });
      } else {
        this.qrcode.makeCode(this.value);
      }
    },
  },
};
</script>

<style scoped>
.qrcode-panel {
  display: flex;
}

.qrcode-panel__instruction {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;

  margin-right: 24px;

  font-size: 16px;
}

.qrcode-panel__instruction ol {
  margin-left: 24px;
}

.qrcode-panel__instruction ol li:not(:first-child) {
  margin-top: 8px;
}

.qrcode-panel__app-name {
  color: #28646E;

  font-weight: 600;
}

.qrcode-panel__app-icon,
.qrcode-panel__qrcode-icon {
  width: 20px;

  vertical-align: bottom;
}

.qrcode-panel__qrcode-container {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.qrcode-panel__qrcode-frame {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
