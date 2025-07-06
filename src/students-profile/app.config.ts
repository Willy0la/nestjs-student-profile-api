export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    uri: process.env.DB ?? 'mongodb://localhost:27017/defaultdb',
  },
});
