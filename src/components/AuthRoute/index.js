import { getToken } from "@/utils"
import { Navigate } from 'react-router-dom';

export function AuthRoute({children}){
    if(getToken()){
        return <>{children}</>
    }else{
        return <Navigate to={'/login'} replace />
    }
}