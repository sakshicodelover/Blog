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
       comments.push({id : commentId , content , status : 'pending'})
       commentsByPostId[req.params.id] = comments;
         await axios.post('http://localhost:4005/events',{
               type : 'CommentCreated',
               data : {id : commentId,postId,content,status : 'pending' }
           })
    res.status(201).send(comments);
})

app.post('/events',async(req,res)=>{
     const {type} = req.body;
     console.log('type' , type , req.body);
     if(type == 'CommentModerated'){
       const { id, postId , status, content} = req.body;
       const comments = commentsByPostId[postId];
       const comment = comments.find(comment =>{
         return comment.id == id;
       })
       comment.status = status;
       console.log('test comment', comment);
       await axios.post('http://localhost:4005/events',{
          type : 'CommentUpdated',
           data:{
             id : comment.id ,
              postId , status, content
           }
       })
     }
    console.log('event received:', req.body.type);
    res.send({});
})

app.listen(4001, ()=>{
    console.log('listening on 4001')
})