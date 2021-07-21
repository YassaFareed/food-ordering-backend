export default interface ITokenService{
    encode(payload: string | object): string | object  //takes string or object and return string or an object
    decode(token: string | object ): string | object //takes string or object and return string or object
}