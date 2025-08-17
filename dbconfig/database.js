module.exports = {
    HOST: process.env.DB_HOST || 'localhost',
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASS || '',   // use env DB_PASS
    DB: process.env.DB || ' N-instructor',
    PORT: process.env.DB_PORT || 3306,     // use env DB_PORT
    dialect: 'mysql',
};
