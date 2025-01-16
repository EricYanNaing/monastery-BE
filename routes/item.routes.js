const express = require('express');
const itemService = require('../services/item.service');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.use(verifyToken);

router.post('/', itemService.create);
router.get('/', itemService.findAll);
router.get('/:id', itemService.findOne);
router.put('/:id', itemService.update);
router.delete('/:id', itemService.delete);

module.exports = router;