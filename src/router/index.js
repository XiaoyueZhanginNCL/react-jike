import Layout from "../pages/Layout";
import Login from "../pages/Login";
import { createBrowserRouter } from 'react-router-dom'
import { AuthRoute } from "@/components/AuthRoute";
import {Suspense, lazy} from 'react';
// import Publish from '@/pages/Publish'
// import Article from '@/pages/Article'
// import Home from '@/pages/Home'
const Publish =lazy(() => import ('@/pages/Publish' ))
const Article =lazy(() => import ('@/pages/Article' ))
const Home =lazy(() => import ('@/pages/Home' ))

const router=createBrowserRouter([
    {
        path:'/',
        element:<AuthRoute><Layout /></AuthRoute>,
        children:[
            {
                index:true,
                element:<Suspense fallback={'Loading'}> <Home /> </Suspense>
                // element:<Home />
            },
            {
                path:'article',
                element:<Suspense fallback={'Loading'}> <Article /> </Suspense>
                // element:<Article />
            },
            {
                path:'publish',
                element:<Suspense fallback={'Loading'}> <Publish /> </Suspense>
                // element:<Publish />
            }
        ]
    },
    {
        path:'/login',
        element:<Login />
    }
]);

export default router;