
//2 methods to take password and return hash 
export default interface IPasswordService {
    hash(password: string): Promise<string>  //accepts password and generate hash and return hash 
    compare(password: string, hash: string): Promise<boolean> //takes raw password and hash string and compare these 2 to return if they matches of not (1 or 0)
}