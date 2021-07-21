import * as express from 'express'
import AuthRepository from '../data/repository/AuthRepository';
import IAuthRepository from '../domain/IAuthRepository';
import IPasswordService from '../services/IPasswordService';
import ITokenService from '../services/ITokenService';
import SignInUseCase from '../usecases/SignInUseCase';
import AuthController from './AuthController';

export default class AuthRouter{
    public static configure(                    //this method will return the express Router (we will need authrepo used by usecase, tokenservice used by controller,)
        authRepository: IAuthRepository,
        tokenService: ITokenService,
        passwordService:IPasswordService
        ): express.Router{
            const router = express.Router() 
            let controller = AuthRouter.composeController(
                authRepository,
                tokenService,
                passwordService
            )
            router.post('/signin',(req,res)=>controller.signin(req,res)) //call the controller passing the req and res whenever signin
            return router
    }

    private static composeController(
        authRepository:IAuthRepository,
        tokenService: ITokenService,
        passwordService: IPasswordService
    ): AuthController{
        const signInUseCase = new SignInUseCase(authRepository, passwordService)
        const controller = new AuthController(signInUseCase,tokenService)
        return controller
    }
}