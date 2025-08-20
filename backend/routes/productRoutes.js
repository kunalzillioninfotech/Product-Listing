const express = require('express');
const { getProducts, createProduct, deleteProduct, updateProduct } = require('../controllers/productController');
const router = express.Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.delete('/:id', deleteProduct);
router.put('/:id', updateProduct);

module.exports = router;