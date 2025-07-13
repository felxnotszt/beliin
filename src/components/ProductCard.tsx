// src/components/ProductCard.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  Box,
  Chip,
} from '@mui/material';
import { Product } from '../types';
import { Edit, Delete } from '@mui/icons-material';

interface ProductCardProps {
  product: Product;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image || '/api/placeholder/300/200'}
        alt={product.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary">
            Rp {product.price.toLocaleString()}
          </Typography>
          <Chip
            label={`Stock: ${product.stock}`}
            color={product.stock > 0 ? 'success' : 'error'}
            size="small"
          />
        </Box>
      </CardContent>
      <CardActions>
        {isAdmin ? (
          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
            <Button
              size="small"
              startIcon={<Edit />}
              onClick={() => onEdit?.(product)}
              variant="outlined"
            >
              Edit
            </Button>
            <Button
              size="small"
              startIcon={<Delete />}
              onClick={() => onDelete?.(product.id)}
              variant="outlined"
              color="error"
            >
              Delete
            </Button>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ ml: 1 }} color="text.secondary">
            {/* Tidak tersedia untuk pembelian */}
          </Typography>
        )}
      </CardActions>
    </Card>
  );
};

export default ProductCard;
