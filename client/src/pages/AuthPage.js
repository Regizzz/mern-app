import React, { useContext, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import { AuthContext } from '../context/AuthContext'

export const AuthPage = () => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, request, error, clearError} = useHttp()
  const [from, setForm] = useState ({
    email: '', password: ''
  })

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  useEffect(() => {
    window.M.updateTextFields()
  })

  const changeHandler = event => {
    setForm({ ...from, [event.target.name]: event.target.value })
  }

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', {...from})
      message(data.message)
    } catch (error) {
      
    }
  }

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', {...from})
      auth.login(data.token, data.userId)
    } catch (error) {
      
    }
  }
 
  return (
    <div className="row">
      <div className=".col.s6.offset-s3">
        <h1>Some shitty text for ya</h1>
        <div className="card grey lighten-5">
          <div className="card-content white-text">
            <span className="card-title">Authentication</span>
            <div>

              <div className="input-field">
                <input
                  placeholder="Enter email" 
                  id="email" 
                  type="text"
                  name="email"
                  value={from.email}
                  onChange={changeHandler}
                />
                <label htmlFor="email">Email</label>
              </div>

              <div className="input-field">
                <input
                  placeholder="Enter password" 
                  id="password" 
                  type="password"
                  name="password"
                  value={from.password}
                  onChange={changeHandler}
                />
                <label htmlFor="password">Password</label>
              </div>
            
            </div>
          </div>
        <div className="card-action">
          <button className="btn yellow darken-4" style={{marginRight: 10}} disabled={loading} onClick={loginHandler}>Log In</button>
          <button className="btn grey lighnet-1 black-text" onClick={registerHandler} disabled={loading}>Sign In</button>
        </div>
      </div>
      </div> 
    </div>
  )
}