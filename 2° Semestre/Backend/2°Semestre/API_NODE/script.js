import express from "express";
const server = express()
server.use(express.json())
const users = []
server.listen(3000, () => console.log("a"))
server.get('/usuarios', (req,res)=>{
    res.status(200).json(users);    
})
server.post('/usuarios', (req,res) => {
    users.push(req.body)
        res.status(208).json(req.body)    
})