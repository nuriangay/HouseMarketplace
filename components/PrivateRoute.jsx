import React from 'react'
import {Navigate,Outlet} from 'react-router-dom'
import { useAuthStatus } from '../hook/useAuthStatus'

const PrivateRoute = () => {
    const {LoggedIn,checkingStatus}=useAuthStatus()
    if(checkingStatus ){
        return <h3>loading..</h3>
    }
  return (
  LoggedIn ? <Outlet/> : <Navigate to='/sign-in'/>
  )
  
}

export default PrivateRoute