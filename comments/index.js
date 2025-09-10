const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const cors = require('cors');
const axios = require('axios');
const app = express();
app.use(cors());
const commentsByPostId = {};
 app.use(bodyParser.json());
app.get('/posts/:id/comments',(req,res)=>{
  res.send(commentsByPostId[req.params.id] || []);
})

app.post('/posts/:id/comments', async(req,res)=>{
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    let postId = req.params.id;
     let comments = commentsByPostId[req.params.id] || [];
       console.log('check',comments)
       comments.push({id : commentId , content})
       commentsByPostId[req.params.id] = comments;
         await axios.post('http://localhost:4005/events',{
               type : 'CommentCreated',
               data : {commentId,postId,content }
           })
    res.status(201).send(comments);
})

app.post('/events',(req,res)=>{
    console.log('event received:', req.body.type);
    res.send({});
})

app.listen(4001, ()=>{
    console.log('listening on 4001')
})