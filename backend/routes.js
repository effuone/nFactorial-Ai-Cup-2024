const express = require('express')
const run = require('./run')
const router = express.Router()

router.get('/analysis', async (req, res) => {
  const nutrients = await run();
  res.json(nutrients)
})

module.exports = router;
