import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    IconButton,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { CartItem as CartItemType } from '../types';

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const total = item.product.price * item.quantity;

    return (
        <Card sx={{ mb: 2 }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
                src={item.product.image}
                alt={item.product.name}
                sx={{ width: 60, height: 60 }}
                variant="rounded"
            />
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{item.product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                Rp {item.product.price.toLocaleString()} each
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                >
                <Remove />
                </IconButton>
                <Typography sx={{ minWidth: 30, textAlign: 'center' }}>
                {item.quantity}
                </Typography>
                <IconButton
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                <Add />
                </IconButton>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6">
                Rp {total.toLocaleString()}
                </Typography>
                <IconButton onClick={() => onRemove(item.id)} color="error">
                <Delete />
                </IconButton>
            </Box>
            </Box>
        </CardContent>
        </Card>
    );
};

export default CartItem;