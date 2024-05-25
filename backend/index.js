require('dotenv').config()
const MealDeducer = require("./MealDeducer")

const deducer = new MealDeducer("img/cheeseburger.jpg", 0.1);
deducer.main();