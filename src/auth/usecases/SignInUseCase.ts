import { urlencoded } from "express";
import IAuthRepository from "../domain/IAuthRepository";
import IPasswordService from "../services/IPasswordService";

export default class SignInUseCase {
    constructor(
        private authRepository: IAuthRepository, 
        private passwordService: IPasswordService //application service required for this application (inside services)
        ){}

    public async execute(name:string,email:string, password:string, type:string): Promise<string> {
        
        if(type === 'email') return this.emailLogin(email,password)// this means we are logging through 3rd party login
        

        return this.oauthLogin(name,email,type) 
    }




    private async emailLogin(email: string, password: string){
        const user = await this.authRepository.find(email).catch((_) => null)
        if(!user || !(await this.passwordService.compare(password,user.password)))
            return Promise.reject('Invalid email or password')
        
        return user.id
    
    }

    private async oauthLogin(name: string, email: string,type: string){
        const user = await this.authRepository.find(email).catch((_) => null)
        if(user && user.type === 'email') 
            return Promise.reject('account already exist, log in with password') //if user is there in db already and signed in before with email
        if(user) return user.id

        const userId = await this.authRepository.add(name,email,type) //if user seems new then add to db
        return userId
    }


}