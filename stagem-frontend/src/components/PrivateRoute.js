import {useSelector} from 'react-redux'
import { Navigate, useLocation } from "react-router-dom";
export default function PrivateRoute({ permittedRoles, children}){
    const user = useSelector((state) => state.user);
    const location = useLocation()

    if(!user.isLoggedIn && localStorage.getItem('token')) {
        return <p>loading...</p>
    }

    if(!user.isLoggedIn) {
        return <Navigate to="/login" /> 
    }

    if (!localStorage.getItem('profile') && !user.myProfile && location.pathname != '/profile/edit'){
        return <Navigate to = "/profile/edit" />
    }
    
    if(!permittedRoles.includes(user.account?.role)) {
        return <Navigate to= "/unauthorized" />
    } 

    return children
}