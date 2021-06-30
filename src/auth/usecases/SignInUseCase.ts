import IAuthRepository from "../domain/IAuthRepository";
import IPasswordService from "../services/IPasswordService";

export default class SignInUseCase {
    constructor(
        private authRepository: IAuthRepository, 
        private passwordService: IPasswordService //application service required for this application (inside services)
        ){}

    public async execute(email:string, password:string): Promise<string> {
        const user = await this.authRepository.find(email) //the user should await find method from the auth repo
        if(password=='' && user) return user.id // this means we are logging through 3rd party login
        if(!await this.passwordService.compare(password,user.password)){
            return Promise.reject('Invalid email or password')
        }

        return user.id


    }


}