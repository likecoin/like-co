const debug = process.env.NODE_ENV !== 'production';

const HOST = debug ? 'http://localhost:3000' : '';
export default HOST;
