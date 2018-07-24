import test from 'ava';
import axios from 'axios';

test('MISC: Get USD price from coingecko', async (t) => {
  let usd;
  try {
    const res = await axios.get('https://api.coingecko.com/api/v3/coins/likecoin?localization=false');
    ({ usd } = res.data.market_data.current_price);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
  t.true(usd !== undefined);
});
