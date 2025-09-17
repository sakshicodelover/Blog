const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.post('/events',async(req,res)=>{
  console.log('test here');
  const {type,data} = req.body;
   if(type === 'CommentCreated'){
    console.log('inside');
     const status = data.content.includes('orange') ? 'rejected' : 'approved';
     await axios.post('http://localhost:4005/events',{
        type : 'CommentModerated',
        id : data.id,
        postId : data.postId,
        content : data.content,
        status
     })
     res.send({});
   }
})
app.listen(4003,()=>{
    console.log('listening on 4003')
})