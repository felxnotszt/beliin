// src/pages/user/dashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Typography,
  Paper,
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import { useAuth } from '../../contexts/AuthContext';
import { Product } from '../../types';
import { productsAPI } from '../../utils/api';

const UserDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const { user } = useAuth();
  const router = useRouter();

  const fetchProducts = useCallback(async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role !== 'user') {
      router.push('/login');
      return;
    }
    fetchProducts();
  }, [user, router, fetchProducts]);

  if (loading) {
    return (
      <Layout title="User Dashboard">
        <Typography>Loading...</Typography>
      </Layout>
    );
  }

  return (
    <Layout title="User Dashboard">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Products</Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {products.map((product) => (
            <Box key={product.id}>
              <ProductCard
                product={product}
                isAdmin={false}
              />
            </Box>
          ))}
        </Box>

        {products.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No products available at the moment.
            </Typography>
          </Paper>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Layout>
  );
};

export default UserDashboard;
