import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './component/home.js';
import Login from './component/auth/login'
import Register from './component/auth/register.js';
import User from './component/user/user.js';
import SingleArticle from './component/singleArticle';
import SingleArticleForUser from './component/user/post/singleArticleView';
import Admin from './component/admin/admin';
import ForgetPassword from './component/auth/forgetPassword';

function App() {
  const {isLoggedIn} = useSelector(state=>state.authentication)
  console.log(isLoggedIn);
  return (
  <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
        <Route path="/login" element={<Login access = 'user'/>} />
        <Route path='/forgetPassword' element={<ForgetPassword access='user'/>} />
        <Route path="/register" element={<Register access='user'/>}/>
        <Route path="/user" element={<User/>}/>
        <Route path="/article/:id" element={<SingleArticle/>}/>
        <Route path="/user/article/:id" element={<SingleArticleForUser/>} />
        {/* Admin Routes */}
        <Route path='/admin' element={<Admin/>}/>
        <Route path='/admin/register' element={<Register access='admin'/>}/>
        <Route path='/admin/login' element={<Login access='admin'/>}/>
    </Routes>
</BrowserRouter>
</>
     
  );
}

export default App;
