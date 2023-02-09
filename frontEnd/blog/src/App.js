import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './component/home.js';
import Login from './component/user/login.js';
import Register from './component/user/register.js';
import User from './component/user/user.js';
import SingleArticle from './component/singleArticle';
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
    </Routes>
</BrowserRouter>
</>
     
  );
}

export default App;
