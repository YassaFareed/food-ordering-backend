// import 'mocha'
// import chai, {expect } from 'chai'
// import chaiAsPromised from 'chai-as-promised'
// import SignInUseCase from '../../../src/auth/usecases/SignInUseCase'
// import IAuthRepository from '../../../src/auth/domain/IAuthRepository'
// import IPasswordService from '../../../src/auth/services/IPasswordService'
// import FakePasswordService from '../helpers/FakePasswordService'
// import FakeRepository from '../helpers/FakeRepository'


// chai.use(chaiAsPromised)  //configure chai to use this middleware

// describe('SignInUseCase', () =>{
//     let sut: SignInUseCase   //sut = system under test
//     let repository: IAuthRepository
//     let passwordService: IPasswordService
    
//     const user = {
//         email: 'baller@gg.com',
//         id: '1234',
//         name: 'Ken',
//         password: '$2b$10$K0HEqyYUlQLaj.Xkp9tDzuRclzJqdKCYV7gEHtSVIlu8NRtLM6flC',
//         type: 'email',
//       }

//     beforeEach(()=>{
//         repository = new FakeRepository()
//         passwordService = new FakePasswordService()
//         sut = new SignInUseCase(repository, passwordService) //sending repo and passservice in constructor
//     })

//     it('should throw an error when user is not found', async () => {
//         const user = {email: 'wrong@email.com', password: '1234'} 

//         //assert
//         await expect(sut.execute(user.email,user.password)).to.be.rejectedWith(
//             'User not found'
//         )
//     })

//     it('should return user id when email and password is correct', async () => {
//         const id = await sut.execute(user.email, user.password)

//         //assert
//         expect(id).to.be.equal(user.id)
//     })

//     it('should return user id when email is correct and type is not email', async () => {
//         const id = await sut.execute(user.email,'') //as third party donot require password

//         //assert
//         expect(id).to.be.equal(user.id)
//     })
// })


import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import 'mocha'
import IAuthRepository from '../../../src/auth/domain/IAuthRepository'
import IPasswordService from '../../../src/auth/services/IPasswordService'
import SignInUseCase from '../../../src/auth/usecases/SignInUseCase'
import FakePasswordService from '../helpers/FakePasswordService'
import FakeRepository from '../helpers/FakeRepository'

chai.use(chaiAsPromised)

describe('SignInUseCase', () => {
  let sut: SignInUseCase
  let repository: IAuthRepository
  let passowrdService: IPasswordService

  const user = {
    email: 'baller@gg.com',
    id: '1234',
    name: 'Ken',
    password: '$2b$10$K0HEqyYUlQLaj.Xkp9tDzuRclzJqdKCYV7gEHtSVIlu8NRtLM6flC',
    type: 'email',
  }

  beforeEach(() => {
    repository = new FakeRepository()
    passowrdService = new FakePasswordService()
    sut = new SignInUseCase(repository, passowrdService)
  })

  it('should throw error when user is not found', async () => {
    const user = {
      name: '',
      email: 'wrong@email.com',
      password: '1234',
      auth_type: 'email',
    }

    //assert
    await expect(
      sut.execute(user.name, user.email, user.password, user.auth_type)
    ).to.be.rejectedWith('Invalid email or password')
  })

  it('should return user id when email and password is correct', async () => {
    //act
    const id = await sut.execute(
      user.name,
      user.email,
      user.password,
      user.type
    )
    //assert
    expect(id).to.be.equal(user.id)
  })

  it('should return user id when email is correct and type is not email', async () => {
    //arrange
    const user = {
      email: 'tester@gmail.com',
      id: '1556',
      name: 'Ren',
      password: '',
      type: 'google',
    }

    //act
    const id = await sut.execute(user.name, user.email, '', user.type)
    //assert
    expect(id).to.be.equal(user.id)
  })
})