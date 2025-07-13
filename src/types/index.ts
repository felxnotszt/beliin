export interface User {
    id: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    name: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    stock: number;
    image: string;
    createdAt: string;
}

export interface CartItem {
    id: string;
    productId: string;
    userId: string;
    quantity: number;
    product: Product;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
}