const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
    const { start, end } = req.query;

    let filter = {};
    if (start && end) {
        filter.availableDate = {
            $gte: new Date(start),
            $lte: new Date(end)
        };
    }

    try {
        const products = await Product.find(filter);
        res.json(products); 
    } catch (err) {
        res.status(500).json({ error: 'Error fetching products', details: err.message });
    }
};

exports.createProduct = async (req, res) => {
    const { name, price, availableDate } = req.body;

    if (!name || !price || !availableDate) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newProduct = new Product({
            name,
            price,
            availableDate: new Date(availableDate)
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json({ error: 'Error creating product', details: err.message });
    }
}

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    console.log("Deleting product with ID:", id);

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting product', details: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, availableDate } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, price, availableDate: new Date(availableDate) },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: 'Error updating product', details: err.message });
    }
}