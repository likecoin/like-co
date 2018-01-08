const FileHelper = {
  // from https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex
  buf2hex(buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => (`00${x.toString(16)}`).slice(-2)).join('');
  },
  blobToArrayBuffer(blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsArrayBuffer(blob);
    });
  },
  arrayBufferToSha256(buf) {
    return window.crypto.subtle.digest('SHA-256', buf)
      .then(FileHelper.buf2hex);
  },
};

export default FileHelper;
