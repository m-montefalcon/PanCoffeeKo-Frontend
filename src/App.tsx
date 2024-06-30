import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import UsersPage from './Components/HomePages/UsersPage';
import ProductsPage from './Components/HomePages/ProductsPage';
import CategoriesPage from './Components/HomePages/CategoriesPage';
import Suppliers from './Components/HomePages/Suppliers';
import TransactionsPage from './Components/HomePages/TransactionsPage';

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
