import axios from 'axios';
import { User, Product, CartItem } from '../types';

const API_BASE_URL = 'https://686b82f3e559eba90872d92c.mockapi.io';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Users API
export const usersAPI = {
    getAll: () => api.get<User[]>('/users'),
    getById: (id: string) => api.get<User>(`/users/${id}`),
    create: (user: Omit<User, 'id'>) => api.post<User>('/users', user),
    update: (id: string, user: Partial<User>) => api.put<User>(`/users/${id}`, user),
    delete: (id: string) => api.delete(`/users/${id}`),
};

// Products API
export const productsAPI = {
    getAll: () => api.get<Product[]>('/products'),
    getById: (id: string) => api.get<Product>(`/products/${id}`),
    create: (product: Omit<Product, 'id'>) => api.post<Product>('/products', product),
    update: (id: string, product: Partial<Product>) => api.put<Product>(`/products/${id}`, product),
    delete: (id: string) => api.delete(`/products/${id}`),
};

// Cart API
export const cartAPI = {
    getByUserId: (userId: string) => api.get<CartItem[]>(`/cart?userId=${userId}`),
    create: (cartItem: Omit<CartItem, 'id'>) => api.post<CartItem>('/cart', cartItem),
    update: (id: string, cartItem: Partial<CartItem>) => api.put<CartItem>(`/cart/${id}`, cartItem),
    delete: (id: string) => api.delete(`/cart/${id}`),
};