import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


// Páginas públicas
import Home from './pages/Home'
import Register from './pages/Register'
import Products from './pages/Products'
import Login from './pages/Login'
import Recovery from './pages/passwdRecovery'
import Reset from './pages/Reset'
import ErrorPage from './pages/ErrorPage'

// Layouts / Header
import Header from './components/header'
import LojistLayout from './Routes/LojistLayout'


// Páginas privadas (área do lojista)
import AreaDoLojista from './pages/LojistArea'
import Order from './pages/Orders'
import History from './pages/History'
import EditScreen from './pages/Edit'
import PriceTable from './pages/Prices'


// Proteções

import LogedRoute from './Routes/alreadyLoged'
import PrivateRoute from './Routes/PrivateRoute'


createRoot(document.getElementById('root')).render(
<StrictMode>
    <BrowserRouter>
     {/* Header global (se quiser ocultar em algumas telas, mover pra um Layout público) */}
    <Header />


    <Routes>
    {/* Rotas públicas */}
    <Route path="/" element={<Home />} />
    <Route path="/cadastrar" element={<Register />} />
    <Route path="/produtos" element={<Products />} />
    <Route path="/recuperacao" element={<Recovery />} />
    <Route path="/resetar-senha/:token" element={<Reset />} />




        {/* Login bloqueado para usuários já logados */}
        <Route
            path="/login"
            element={
            <LogedRoute>
            <Login />
            </LogedRoute>
            }
        />


{/* =================== ÁREA DO LOJISTA (NESTED) =================== */}
{/* Um ÚNICO caminho "/arealojista" servindo como pai para as rotas filhas */}
     <Route
            path="/arealojista"
            element={
            <PrivateRoute>
            <LojistLayout />
            </PrivateRoute>
        }
        >
{/* rota index = dashboard da área do lojista */}
        <Route index element={<AreaDoLojista />} />


        <Route path="pedidos" element={<Order />} />
        <Route path="historico" element={<History />} />
        <Route path="edit" element={<EditScreen />} />
        <Route path="precos" element={<PriceTable />} />
    </Route>
      
      <Route path="/erro/401" element={<ErrorPage code={401} />} />
      <Route path="/erro/403" element={<ErrorPage code={403} />} />
      <Route path="/erro/500" element={<ErrorPage code={500} />} />
      <Route path="/erro/503" element={<ErrorPage code={503} />} />
      <Route path="*" element={<ErrorPage code={404} />} />
    </Routes>
  </BrowserRouter>
</StrictMode>
)