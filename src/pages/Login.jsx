import React, { useContext, useState } from 'react'
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap'
import '../styles/login.css'
import { Link, useNavigate } from 'react-router-dom'
import loginImg from '../assets/images/login.png'
import userIcon from '../assets/images/user.png'
import { AuthContext } from '../context/AuthContext'
import PocketBase from 'pocketbase'

const pb = new PocketBase('https://remain-faceghost.pockethost.io')

const Login = () => {
   const [credentials, setCredentials] = useState({
      email: '',
      password: ''
   })

   const { dispatch } = useContext(AuthContext)
   const navigate = useNavigate()

   const handleChange = e => {
      setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }))
   }

   const handleClick = async e => {
      e.preventDefault()
   
      dispatch({ type: 'LOGIN_START' })
   
      try {
         const authData = await pb
            .collection('users')
            .authWithPassword(credentials.email, credentials.password)
   
         if (authData) {
            // Check if the user is verified
            if (!authData.record.verified) {
               dispatch({ type: 'LOGIN_FAILURE', payload: 'User not verified' })
               alert('Your account is not verified. Please check your email for verification.')
               return
            }
   
            dispatch({ type: 'LOGIN_SUCCESS', payload: authData.record })
            navigate('/home') // Redirect to home on success
         }
      } catch (err) {
         dispatch({ type: 'LOGIN_FAILURE', payload: err.message })
         alert(err) // Popup error
      }
   }   

   return (
      <section>
         <Container>
            <Row>
               <Col lg="8" className="m-auto">
                  <div className="login__container d-flex justify-content-between">
                     <div className="login__img">
                        <img src={loginImg} alt="Login Illustration" />
                     </div>

                     <div className="login__form">
                        <div className="user">
                           <img src={userIcon} alt="User Icon" />
                        </div>
                        <h2>Login</h2>

                        <Form onSubmit={handleClick}>
                           <FormGroup>
                              <input
                                 type="email"
                                 placeholder="Email"
                                 id="email"
                                 onChange={handleChange}
                                 required
                              />
                           </FormGroup>
                           <FormGroup>
                              <input
                                 type="password"
                                 placeholder="Password"
                                 id="password"
                                 onChange={handleChange}
                                 required
                              />
                           </FormGroup>
                           <Button
                              className="btn secondary__btn auth__btn"
                              type="submit"
                           >
                              Login
                           </Button>
                        </Form>
                        <p>
                           Don't have an account?{' '}
                           <Link to="/register">Create</Link>
                        </p>
                     </div>
                  </div>
               </Col>
            </Row>
         </Container>
      </section>
   )
}

export default Login
