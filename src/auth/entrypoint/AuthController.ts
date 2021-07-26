import ITokenService from "../services/ITokenService";
import SignInUseCase from "../usecases/SignInUseCase";
import * as express from 'express'
import SignUpUseCase from "../usecases/SignUpUseCase";
import SignOutUseCase from "../usecases/SignOutUseCase";

export default class AuthController{

    private readonly signInUseCase: SignInUseCase
    private readonly signUpUseCase: SignUpUseCase
    private readonly signOutUseCase: SignOutUseCase
    private readonly tokenService: ITokenService
    

    constructor(
        signInUseCase: SignInUseCase,
        signUpUseCase: SignUpUseCase,
        signOutUseCase: SignOutUseCase,
        tokenService: ITokenService
        
        ){
        this.signInUseCase = signInUseCase
        this.signUpUseCase = signUpUseCase
        this.signOutUseCase = signOutUseCase
        this.tokenService = tokenService

    }

    public async signin(req: express.Request, res: express.Response){
        try {
            const {name, email, password, auth_type} = req.body //get email and password from body
            return this.signInUseCase 
            .execute(name,email,password,auth_type) //execute the usecase with email and password and 
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


    public async signout(req: express.Request, res: express.Response){
        try {
            const token = req.headers.authorization!//takes the token
            return this.signOutUseCase  
            .execute(token)  //blacklist it
            .then((result) => 
            res.status(200).json({message: result }) //show sign out sucessfully
            )
            .catch((err: Error) =>res.status(404).json({error:err}))
            
        } catch (err){
            return res.status(400).json({error:err})
        }
    }

}