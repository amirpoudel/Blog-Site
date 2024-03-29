import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './component/navbar/navbar';
import Home from './component/home/home.js';
import Login from './component/auth/login'
import Register from './component/auth/register.js';
import User from './component/user/user.js';
import SingleArticle from './component/singleArticle';
import SingleArticleForUser from './component/user/post/singleArticleView';
import Admin from './component/admin/admin';
import ForgetPassword from './component/auth/forgetPassword';
import VerifyToken from './component/auth/verifyToken';
import ResetPassword from './component/auth/resetPassword';

function App() {
  const {isLoggedIn} = useSelector(state=>state.authentication)
  console.log(isLoggedIn);
  return (
  <>
    <BrowserRouter>
    <Navbar/>
    <Routes>

        <Route path='/' element={<Home/>}/>
        <Route path="/login" element={<Login access = 'user'/>} />
        <Route path='/forgetPassword' element={<ForgetPassword access='user'/>} />
        <Route path='/verifyToken' element={<VerifyToken access='user'/> }/>
        <Route path='/resetPassword' element={<ResetPassword access='user'/>}/>
        <Route path="/register" element={<Register access='user'/>}/>
        <Route path="/user" element={<User/>}/>
        <Route path="/article/:id" element={<SingleArticle/>}/>
        <Route path="/user/article/:id" element={<SingleArticleForUser/>} />
        {/* Admin Routes */}
        <Route path='/admin' element={<Admin/>}/>
        <Route path='/admin/register' element={<Register access='admin'/>}/>
        <Route path='/admin/login' element={<Login access='admin'/>}/>
        <Route path='/admin/forgetPassword' element={<ForgetPassword access='admin'/>} />
        <Route path='/admin/verifyToken' element={<VerifyToken access='admin'/> }/>
        <Route path='/admin/resetPassword' element={<ResetPassword access='admin'/>}/>
     
    </Routes>
</BrowserRouter>
</>
     
  );
}

export default App;
