const express = require('express');
const itemService = require('../services/item.service');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.post('/',verifyToken, itemService.create);
router.get('/', itemService.findAll);
router.get('/:id', itemService.findOne);
router.put('/:id',verifyToken, itemService.update);
router.delete('/:id',verifyToken, itemService.delete);

module.exports = router;