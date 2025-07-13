// import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext'; // Pastikan path sesuai dengan project kamu
import { useEffect } from 'react';


const Home = () => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'admin') {
      router.replace('/admin/dashboard');
    } else if (user?.role === 'user') {
      router.replace('/user/dashboard');
    } else {
      router.replace('/login');
    }
  }, [user, router]);

  return null; // kosong karena langsung redirect
};

export default Home;
