import React from 'react'
import { Link } from 'react-router-dom'
function RootLayout() {
  return (
    <div>
        <h1>Login Here:</h1>
        <button><Link to='/login'>Login</Link></button>
        <h3>Or register here</h3>
        <button><Link to='/register'>Register</Link></button>
    </div>
  )
}

export default RootLayout