import React, {useState} from 'react'
import './Login.css'
import {useNavigate, Link} from 'react-router-dom'

import { userState, loggedIn } from '../components/atoms';
import { useSetRecoilState } from 'recoil'

import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LoginIcon from '@mui/icons-material/Login';

function Login() {

  const setLoggedIn = useSetRecoilState(loggedIn)
  const setUserState = useSetRecoilState(userState)
  const [formObj, setFormObj] = useState({
    username: "",
    password: ""
  })

  let navigate = useNavigate()

  function handleChange(e){
      setFormObj(obj => ({...obj, [e.target.id]: e.target.value}))
  }

  function handleSubmit(e){
      e.preventDefault()
      fetch(`/login`,{
        method: "POST",
        headers: { "Content-Type": 'application/json'},
        body: JSON.stringify(formObj)
      })
      .then(res => {
        if(res.ok){
          res.json().then(data => {
            navigate("/feed")
            setLoggedIn(true)
            setUserState({
              username: data.username,
              id: data.id
            })
            setFormObj({
              username: "",
              password: ""
            })
          })
        }     
      })
    }

    const paperStyle = {padding: 20, height:'50vh', width: '20vw', margin: "auto"}
    const avatarStyle = {backgroundColor: 'green'}
    const backgroundStyle = {
      minHeight: '85vh',
      backgroundSize: 'cover',
      backgroundColor: '#BEBEBE',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }

  return (
    <Box style={backgroundStyle}>
      <Grid>
        <Paper elevation={20} style={paperStyle}>
          <Grid align='center'>
            <Avatar style={avatarStyle}><LoginIcon/></Avatar>
            <h2>Login</h2>
          </Grid>
          <form className="login__form" onSubmit={handleSubmit}>
              <TextField
                label="Username"
                id='username'
                value={formObj.username}
                onChange={handleChange}
                placeholder="Enter username"
                fullwidth
                required
              />
              <TextField
                label="Password"
                id='password'
                value={formObj.password}
                onChange={handleChange}
                placeholder="Enter password"
                type='password'
                fullwidth
                required/>
              <Button
                variant="contained"
                type="submit"
                className='login__submit'
                fullwidth
              >
              Login
              </Button>
              <div className="login__text">
                <Typography>{"Don't have an account? "}
                  <Link to="/signup">
                    Sign Up Here
                  </Link>
                </Typography>
              </div>    
          </form>
        </Paper>
      </Grid>
    </Box>
  )
}

export default Login