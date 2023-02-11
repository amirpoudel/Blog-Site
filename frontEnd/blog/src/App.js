import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './component/home.js';
import Login from './component/user/login.js';
import Register from './component/user/register.js';
import User from './component/user/user.js';
import SingleArticle from './component/singleArticle';
import SingleArticleForUser from './component/user/post/singleArticleView';
import AdminRegister from './component/admin/register';
import AdminLogin from './component/admin/login';
function App() {
  const {isLoggedIn} = useSelector(state=>state.authentication)
  console.log(isLoggedIn);
  return (
  <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/user" element={<User/>}/>
        <Route path="/article/:id" element={<SingleArticle/>}/>
        <Route path="/user/article/:id" element={<SingleArticleForUser/>} />
        {/* Admin Routes */}
        <Route path='/admin/register' element={<AdminRegister/>}/>
        <Route path='/admin/login' element={<AdminLogin/>}/>
    </Routes>
</BrowserRouter>
</>
     
  );
}

export default App;
