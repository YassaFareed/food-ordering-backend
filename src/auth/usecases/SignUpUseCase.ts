import IAuthRepository from "../domain/IAuthRepository"
import IPasswordService from "../services/IPasswordService"

export default class SignUpUseCase{
    constructor(
        private authRepository: IAuthRepository,
        private passwordService: IPasswordService
        ){}

        public async execute(
            name: string,
            authType: string,
            email: string,
            password: string
        ): Promise<string> {
            const user = await this.authRepository.find(email).catch((_) => null) //find email if not exist it will return reject promise (if it catch that error it will pass null to user object)
            if(user) return Promise.reject('User already exists')

            const userId = await this.authRepository.add(
                name,
                email,
                await this.passwordService.hash(password),  //hashed password neeeds to be saved (hashed password will be saved to db)
                authType
            )
            return userId
            }

        
}