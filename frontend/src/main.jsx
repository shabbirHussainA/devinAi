import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'remixicon/fonts/remixicon.css'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import {Home,Login,Signup,Logout} from './pages'
import store from './store/store.js'
import { Provider } from 'react-redux'
import Project from './pages/Project.jsx'
const router = createBrowserRouter([
  {
    path: '/',
    element:<App/>,
    children:[
     {
      path:'/dashboard',
      element:<Home/>
    },
    {
      path:'/login',
      element:<Login/>
    },
    {
      path: '/signup',
      element:<Signup/>
    },
    {
      path: '/project',
      element: <Project/>
    }

    ]
  },
  {
    path:'/logout',
    element: <Logout/>,
  },
 
])
createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  </>,
)
