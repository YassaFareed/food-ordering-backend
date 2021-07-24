import User from "./User";


export default interface IAuthRepository{
    find(email: string): Promise<User> //promise is same as future in flutter (find by email address)
    add(
        name: string,
        email:string,
        type:string,
        passwordHash?:string  //password optional
        ): Promise<string> //this will return a string promise that will represent user id

}