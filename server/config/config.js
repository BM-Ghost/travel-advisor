// server/config/config.js
require('dotenv').config();

module.exports = {
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
};