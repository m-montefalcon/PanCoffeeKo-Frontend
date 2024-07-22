import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import UsersPage from './pages/HomePages/UsersPage';
import ProductsPage from './pages/HomePages/ProductsPage';
import CategoriesPage from './pages/HomePages/CategoriesPage';
import Suppliers from './pages/HomePages/Suppliers';
import TransactionsPage from './pages/HomePages/TransactionsPage';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<LoginPage />}></Route>
                <Route path='/home' element={<HomePage />}></Route>
                <Route path='/users' element={<UsersPage />}></Route>
                <Route path='/products' element={<ProductsPage />}></Route>
                <Route path='/categories' element={<CategoriesPage />}></Route>
                <Route path='/suppliers' element={<Suppliers />}></Route>
                <Route path='/transactions' element={<TransactionsPage />}></Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
