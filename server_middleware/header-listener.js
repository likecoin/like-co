import onHeaders from 'on-headers';

export default function (req, res, next) {
  // req is the Node.js http request object
  onHeaders(res, () => {
    /* https://github.com/nuxt/nuxt.js/issues/5627 */
    const cspHeader = res.getHeader('Content-Security-Policy');
    if (cspHeader && !cspHeader.includes("script-src 'unsafe-inline'")) {
      const newHeader = cspHeader.replace('script-src', "script-src 'unsafe-inline'");
      res.setHeader('Content-Security-Policy', newHeader);
    }
  });
  next();
}
