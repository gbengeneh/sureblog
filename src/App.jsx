import { useState } from 'react'
import './App.css'
import { Route,  BrowserRouter as Router, Routes } from 'react-router-dom'
import PostList from './components/PostList'
import Register from './components/Register'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import PostCreate from './components/PostCreate'
import PostDetails from './components/PostDetails'
import PostEdit from './components/PostEdit'
import Categories from './components/Categories'


 
function App() {

  
  return (
    <AuthProvider>
      <Router>
        <Header />
      </Router>
   <Router>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/create" element={<ProtectedRoute> <PostCreate />  </ProtectedRoute>} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/posts/create" element={<ProtectedRoute> <PostEdit />  </ProtectedRoute>} />
        <Route path="/categories" element={ <Categories />} />
        <Route path="/" element={ <PostList />} />
      </Routes>
   </Router>
   </AuthProvider>
  )
}

export default App
