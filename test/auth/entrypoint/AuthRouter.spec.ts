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

    //-------------Sign in tests ------------
    
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

      // -----------Sign up tests------------
    
      it('should return errors', async () => {
        await request(app)
          .post('/auth/signup')
          .send({email: '', password: user.password, auth_type: 'email'})
          .set('Accept', 'application/json')
          .expect('Content-type', /json/)
          .expect(422)
          .then((res) => {
            expect(res.body.errors).to.not.be.empty
          })
      })
  

     
    it('should create user and create token', async () => { //signup integration test for dummy data
        let email = 'my@email.com'
        let name = 'test user'
        let password = 'pass123'
        let type = 'email'

        await request(app)
          .post('/auth/signup')
          .send({email: email, password: password, auth_type:type, name: name })
          .set('Accept', 'application/json')
          .expect('Content-type', /json/)
          .expect(200)
          .then((res) => {
            expect(res.body.auth_token).to.not.be.empty //token should not be empty if everything works
          })
      }) //as we are using fake repository the data will not be passed to database
     
})



//we used super test we donot have to use postman (so install supertest using npm
//it is an integration testing
