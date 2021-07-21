import IPasswordService from "../../services/IPasswordService";
import bcrypt from 'bcrypt';

 export default class BcryptPasswordService implements IPasswordService{
     constructor(private readonly saltRounds: number = 10){         // the higher the number the more slower the more safe the hash

     } 
     hash(password: string): Promise<string>{
        return bcrypt.hash(password, this.saltRounds)
    }
     compare(password: string, hash: string): Promise<boolean> {
         return bcrypt.compare(password, hash)
     }
     
 }