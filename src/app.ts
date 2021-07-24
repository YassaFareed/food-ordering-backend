import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import CompositionRoot from './CompositionRoot'

dotenv.config()
CompositionRoot.configure()

const PORT = process.env.PORT

const app = express() //instantiate express app

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/auth', CompositionRoot.authRouter()) //configure all the dependencies to keep the app.ts slim

app.listen(PORT, () => console.log(`listening on port ${PORT}`))