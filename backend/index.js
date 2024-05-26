const express = require('express')
const port = 4000
const router = require('./routes')

const app = express()
app.use(router)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});