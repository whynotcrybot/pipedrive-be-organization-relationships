module.exports = {
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || 'root',
  DB_DATABASE: process.env.DB_DATABASE || 'pipedrive',
  PORT: 3000,
};
