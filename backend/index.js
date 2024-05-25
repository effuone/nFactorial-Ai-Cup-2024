require('dotenv').config()
const MealDeducer = require("./MealDeducer")

const deducer = new MealDeducer("img/chicken-broccoli.jpg", 0.1);
deducer.main();