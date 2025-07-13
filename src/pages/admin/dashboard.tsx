import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Typography,
  Button,
//   Grid,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import GridMUI, { GridProps } from '@mui/material/Grid'; // <== PERBAIKAN DI SINI
import { Add } from '@mui/icons-material';

import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import ProductForm from '../../components/ProductForm';
import { useAuth } from '../../contexts/AuthContext';
import { Product } from '../../types';
import { productsAPI } from '../../utils/api';

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; productId: string }>({
    open: false,
    productId: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchProducts();
  }, [user, router]);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      const newProduct = {
        ...productData,
        createdAt: new Date().toISOString(),
      };
      await productsAPI.create(newProduct);
      fetchProducts();
    } catch {
      setError('Failed to add product');
    }
  };

  const handleEditProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    if (!editingProduct) return;

    try {
      await productsAPI.update(editingProduct.id, productData);
      fetchProducts();
      setEditingProduct(undefined);
    } catch {
      setError('Failed to update product');
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await productsAPI.delete(deleteDialog.productId);
      fetchProducts();
      setDeleteDialog({ open: false, productId: '' });
    } catch {
      setError('Failed to delete product');
    }
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const openDeleteDialog = (productId: string) => {
    setDeleteDialog({ open: true, productId });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(undefined);
  };

  if (loading) {
    return (
      <Layout title="Admin Dashboard">
        <Typography>Loading...</Typography>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Dashboard">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Product Management</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => setShowForm(true)}>
            Add Product
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <GridMUI container spacing={3}>
          {products.map((product) => (
            <GridMUI
              key={product.id}
              {...({
                item: true,
                xs: 12,
                sm: 6,
                md: 4,
              } as GridProps)}
            >
              <ProductCard
                product={product}
                isAdmin={true}
                onEdit={openEditForm}
                onDelete={openDeleteDialog}
              />
            </GridMUI>
          ))}
        </GridMUI>

        {products.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No products found. Add your first product to get started.
            </Typography>
          </Paper>
        )}
      </Box>

      <ProductForm
        open={showForm}
        onClose={closeForm}
        onSave={editingProduct ? handleEditProduct : handleAddProduct}
        product={editingProduct}
      />

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, productId: '' })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, productId: '' })}>Cancel</Button>
          <Button onClick={handleDeleteProduct} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default AdminDashboard;
