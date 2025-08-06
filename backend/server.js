import express from 'express'
import cors from 'cors'
import 'dotenv/config'

const app = express();
const PORT = 4000;

app.use(cors())

//CONNECT DB

//MIDDLEWARE
app.use(express.json())

//ROUTES

app.get('/',(req,res) => {
    res.send('API WORKING')
})

app.listen(PORT, () =>{
    console.log(`Server Started on http://localhost:${PORT}`)
})
