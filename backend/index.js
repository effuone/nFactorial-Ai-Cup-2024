require('dotenv').config()
const MealDeducer = require("./MealDeducer")

const deducer = new MealDeducer(process.env.GROQ_API)
deducer.main()