const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());
const posts = {};
app.get('/posts', (req,res)=>{
   res.send(posts);
})
app.post('/events', (req,res)=>{
    const {type ,data} = req.body;
     if(type === 'PostCreated'){
       const {id,title} = data;
       posts[id] = { id , title, comments : []};
     }
      if(type === 'CommentCreated'){
        console.log(data);
       const {commentId , postId , content} = data;
       const post = posts[postId];
       console.log(post);
        post.comments.push({commentId, content});
     }
     console.log(posts);
     res.send({});

})
app.listen(4002,()=>{
    console.log('listening on 4002')
})