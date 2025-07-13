import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Typography,
  Button,
  Paper,
  Box,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ArrowBack, ShoppingBag } from '@mui/icons-material';
import Layout from '../../components/Layout';
import CartItem from '../../components/CartItem';
import { useAuth } from '../../contexts/AuthContext';
import { CartItem as CartItemType } from '../../types';
import { cartAPI, productsAPI } from '../../utils/api';

const UserCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutDialog, setCheckoutDialog] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== 'user') {
      router.push('/login');
      return;
    }

    const fetchCartItems = async () => {
      if (!user) return;
      try {
        const response = await cartAPI.getByUserId(user.id);
        setCartItems(response.data);
      } catch {
        setError('Failed to load cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user, router]);

  const handleUpdateQuantity = async (cartId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await cartAPI.update(cartId, { quantity: newQuantity });
      const response = await cartAPI.getByUserId(user!.id);
      setCartItems(response.data);
    } catch {
      setError('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (cartId: string) => {
    try {
      const item = cartItems.find(item => item.id === cartId);
      if (item) {
        await productsAPI.update(item.productId, {
          stock: item.product.stock + item.quantity,
        });
        await cartAPI.delete(cartId);
        const response = await cartAPI.getByUserId(user!.id);
        setCartItems(response.data);
      }
    } catch {
      setError('Failed to remove item from cart');
    }
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        await cartAPI.delete(item.id);
      }

      setCheckoutDialog(false);
      router.push('/user/dashboard');
    } catch {
      setError('Failed to process checkout');
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <Layout title="Shopping Cart">
        <Typography>Loading...</Typography>
      </Layout>
    );
  }

  return (
    <Layout title="Shopping Cart">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push('/user/dashboard')}
            sx={{ mr: 2 }}
          >
            Back to Products
          </Button>
          <Typography variant="h4">Shopping Cart</Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {cartItems.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your cart is empty
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push('/user/dashboard')}
              sx={{ mt: 2 }}
            >
              Continue Shopping
            </Button>
          </Paper>
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </Box>

            <Paper sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">
                  Total Items: {cartItems.length}
                </Typography>
                <Typography variant="h5" color="primary">
                  Total: Rp {totalPrice.toLocaleString()}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingBag />}
                onClick={() => setCheckoutDialog(true)}
                fullWidth
              >
                Proceed to Checkout
              </Button>
            </Paper>
          </>
        )}
      </Box>

      <Dialog open={checkoutDialog} onClose={() => setCheckoutDialog(false)}>
        <DialogTitle>Confirm Purchase</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to purchase these items for Rp{' '}
            {totalPrice.toLocaleString()}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckoutDialog(false)}>Cancel</Button>
          <Button onClick={handleCheckout} variant="contained">
            Confirm Purchase
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default UserCart;
