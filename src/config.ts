const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path: path.join(__dirname, '..', '.env')}); // call dotenv to load variables from .env file