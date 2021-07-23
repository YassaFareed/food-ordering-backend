import ITokenService from "../services/ITokenService";
import SignInUseCase from "../usecases/SignInUseCase";
import * as express from 'express'
import SignUpUseCase from "../usecases/SignUpUseCase";

export default class AuthController{

    private readonly signInUseCase: SignInUseCase
    private readonly signUpUseCase: SignUpUseCase
    private readonly tokenService: ITokenService
    

    constructor(
        signInUseCase: SignInUseCase,
        signUpUseCase: SignUpUseCase,
        tokenService: ITokenService
        ){
        this.signInUseCase = signInUseCase
        this.signUpUseCase = signUpUseCase
        this.tokenService = tokenService
    }

    public async signin(req: express.Request, res: express.Response){
        try {
            const {email,password} = req.body //get email and password from body
            return this.signInUseCase 
            .execute(email,password) //execute the usecase with email and password and 
            .then((id:string) => res.status(200).json({auth_token: this.tokenService.encode(id)}) //then when id returned this will generate the token for us and return that in the response object
            )
            .catch((err: Error) =>res.status(404).json({error:err.message}))
            
        } catch (err){
            return res.status(400).json({error:err})
        }
    }

    public async signup(req: express.Request, res: express.Response){
        try {
            const {name, email, password, auth_type} = req.body //get email and password from body
            return this.signUpUseCase 
            .execute(name,auth_type, email,password) //execute the usecase with email and password and 
            .then((id:string) => 
            res.status(200).json({auth_token: this.tokenService.encode(id)}) //then when id returned this will generate the token for us and return that in the response object
            )
            .catch((err: Error) =>res.status(404).json({error:err}))
            
        } catch (err){
            return res.status(400).json({error:err})
        }
    }

}