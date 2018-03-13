import { Nuxt, Builder } from 'nuxt';
import { resolve } from 'path';

export default async function initNuxt() {
  const rootDir = resolve(__dirname, '../../');
  let config = {};
  try {
    /* eslint global-require: "off" */
    /* eslint import/no-dynamic-require: "off" */
    config = require(resolve(rootDir, 'nuxt.config.js'));
  } catch (e) {
    console.error(e); /* eslint no-console: "off" */
  }
  config.rootDir = rootDir; // project folder
  config.dev = false; // production build
  const nuxt = new Nuxt(config);
  await new Builder(nuxt).build();
  return nuxt;
}
