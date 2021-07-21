import express from 'express'
import {expect} from 'chai'
import IAuthRepository from "../../../src/auth/domain/IAuthRepository"
import FakeRepository from "../helpers/FakeRepository"
import JwtTokenService from "../../../src/auth/data/services/JwtTokenService"
import BcryptPasswordService from "../../../src/auth/data/services/BcryptPassowordService"
import request from 'supertest'
import AuthRouter from '../../../src/auth/entrypoint/AuthRouter'
import { UserSchema } from '../../../src/auth/data/models/UserModel'

describe('AuthRouter', ()=>{
    let repository: IAuthRepository
    let app: express.Application

    const user = {
        email: 'baller@gg.com',
        id:'1234',
        name:'Ken',
        password:'pass',
        type:'email'
    }

    beforeEach(()=>{
        repository = new FakeRepository()
        let tokenService = new JwtTokenService('privatekey')
        let passwordService = new BcryptPasswordService()

        app = express()
        app.use(express.json()) //configuring the json middleware
        app.use(express.urlencoded({extended: true})) //configure this as well(without configure the json body cannot be used)
        app.use(
            '/auth',
             AuthRouter.configure(repository,tokenService,passwordService)
             ) //when /auth/signin is used the sign in will occur at the controller

            })  
    it('should return 404 when user is not found', async()=>{
        await request(app).post('/auth/signin').send({}).expect(404)
    })  //sending empty json for the request body for auth/signin endpoint
   

    it('should return 200 and token when user is found', async () => {
        await request(app)
          .post('/auth/signin')
          .send({email: user.email, password: user.password})
          .set('Accept', 'application/json')
          .expect('Content-type', /json/)
          .expect(200)
          .then((res) => {
            expect(res.body.auth_token).to.not.be.empty
          })
      })
   
})



//we used super test we donot have to use postman (so install supertest using npm
