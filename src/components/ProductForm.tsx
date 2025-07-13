import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
} from '@mui/material';
import { Product } from '../types';

interface ProductFormProps {
    open: boolean;
    onClose: () => void;
    onSave: (product: Omit<Product, 'id' | 'createdAt'>) => void;
    product?: Product;
}

const ProductForm: React.FC<ProductFormProps> = ({
    open,
    onClose,
    onSave,
    product,
}) => {
const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    stock: 0,
    image: '',
});

    useEffect(() => {
    if (product) {
        setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
        stock: product.stock,
        image: product.image,
    });
    } else {
        setFormData({
        name: '',
        price: 0,
        description: '',
        stock: 0,
        image: '',
        });
    }
}, [product, open]);

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
    };

    return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
        <DialogTitle>
            {product ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
                <TextField
                name="name"
                label="Product Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
            />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                name="price"
                label="Price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 0 }}
            />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                name="stock"
                label="Stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 0 }}
            />
            </Grid>
            <Grid item xs={12}>
                <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                required
            />
            </Grid>
            <Grid item xs={12}>
                <TextField
                name="image"
                label="Image URL"
                value={formData.image}
                onChange={handleChange}
                fullWidth
                placeholder="https://example.com/image.jpg"
            />
            </Grid>
        </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained">
            {product ? 'Update' : 'Add'} Product
            </Button>
        </DialogActions>
    </form>
    </Dialog>
);
};

export default ProductForm;