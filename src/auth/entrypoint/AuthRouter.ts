import * as express from 'express'
import AuthRepository from '../data/repository/AuthRepository';
import IAuthRepository from '../domain/IAuthRepository';
import { signupValidationRules, validate } from '../helpers/Validators';
import IPasswordService from '../services/IPasswordService';
import ITokenService from '../services/ITokenService';
import SignInUseCase from '../usecases/SignInUseCase';
import SignUpUseCase from '../usecases/SignUpUseCase';
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
            router.post(
                '/signup',
                signupValidationRules,
                validate,
                (req: express.Request,res:express.Response) =>
                controller.signup(req,res)
                )//the middlewares are also added like signupvalidationrules, then validate to apply the rules 
            return router
    }

    private static composeController(
        authRepository:IAuthRepository,
        tokenService: ITokenService,
        passwordService: IPasswordService
    ): AuthController{
        const signInUseCase = new SignInUseCase(authRepository, passwordService)
        const signUpUseCase = new SignUpUseCase(authRepository, passwordService)
        const controller = new AuthController(
            signInUseCase,
            signUpUseCase,
            tokenService)
        return controller
    }
}