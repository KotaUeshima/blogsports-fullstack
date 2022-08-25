import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import Comments from '../components/Comments';

import {userState} from '../components/atoms';
import {useRecoilValue} from 'recoil'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Badge from '@mui/material/Badge'
import { IconButton } from '@mui/material'

import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

function Blog() {

  const recoilUser = useRecoilValue(userState)
  const [blog, setBlog] = useState(null)
  const {id} = useParams()
  const [likesOnPage, setLikesOnPage] = useState(null)
  const [userHasLiked, setUserHasLiked] = useState(false)

  useEffect(() => {
    fetch(`/blogs/${id}`)
    .then(res => res.json())
    .then(data => {
      setBlog(data)
      setLikesOnPage(data.likes)
      setUserHasLiked(data.likedusers.includes(recoilUser.username))
    })
  }, [])

  if(blog == null) return <div>Loading...</div>
  let {title, content, likes, dislikes, category, user} = blog


  function increaseLikes(){
      fetch(`/blogs/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          likes: likes + 1,
        })
      })
      .then(res => {
        if(res.ok){
          res.json().then(data => {
            setLikesOnPage(data.likes)
            setUserHasLiked(data.likedusers.includes(recoilUser.username))
        })}})
  }

  function decreaseLikes(){
    fetch(`/blogs/${id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({dislikes: dislikes + 1})
    })
    .then(res => res.json())
    .then(console.log)
  }

  const backgroundStyle = {
    height: '85vh',
    backgroundColor: 'white',
    overflow: 'auto',
  }

  const pageStyle = {
    height: '85vh',
    backgroundColor: 'white',
    margin: '10vh',
    marginTop: '30px'
  }

  return (
    <Container style={backgroundStyle}>
      <Box style={pageStyle}>
        <Grid container>
          <Grid item xs={9}>
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={increaseLikes}>
              <Badge badgeContent={likesOnPage}>
                {userHasLiked? <ThumbUpAltIcon/> : <ThumbUpOffAltIcon/>}
              </Badge>
            </IconButton>
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={decreaseLikes}>
              <Badge badgeContent={dislikes}>
                <ThumbDownOffAltIcon/>
              </Badge>
            </IconButton>
          </Grid>
          <Grid item xs={1}>
            <p>{user.username}</p>
          </Grid>
          <Grid item xs={11}>
            <h1>{title}</h1>
          </Grid>
          <Grid item xs={1}>
            <h2>{category}</h2>
          </Grid>
          <Grid item xs={12}>
            <p>{content}</p>
          </Grid>
          <Comments id={id} user_id={recoilUser.id}/>
        </Grid>
      </Box>
    </Container>
  )
}

export default Blog