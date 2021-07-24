import { NextFunction, Request, Response } from 'express'
import {body, validationResult} from 'express-validator'

export const signupValidationRules = () => { //takes the list in array
    return[
        body('name','Name is required').notEmpty(), //name field should not be empty
        body('email', 'Invalid email').notEmpty().isEmail().normalizeEmail(),
        body('auth_type', 'Auth Type is required').notEmpty(),
        body('password','Password is required (min of 5 characters)')
        .if(body('auth_type').equals('email'))
        .notEmpty()
        .isLength({min:5}),
    ]
}

export const signinValidationRules = () => { //takes the list in array
    return[
        body('name','Name is required')
        .notEmpty()
        .if(body('auth_type').not().equals('email')), //if authtype is not email then name is required
        body('email', 'Invalid email').not().isEmpty().isEmail().normalizeEmail(),
        body('auth_type', 'Auth Type is required').notEmpty(),
        body('password','Password is required (min of 5 characters)')//password when auth type is email 
        .notEmpty()
        .if(body('auth_type')
        .equals('email'))
        .isLength({min:5}),
    ]
}


export const validate = (req: Request, res: Response, next: NextFunction) => { //for this validate function the req,response and next function from express will be needed
    const errors = validationResult(req) //it will validate request based on rules
    if(errors.isEmpty()){  //if there are no errors
        return next() //then execute next function(usecase from controller )
    }
    const extractedErrors: any = [] //type any
    errors
    .array({onlyFirstError: true}) //only first error set to true (so only one instance of error return)
    .map((err) => extractedErrors.push({ [err.param]: err.msg })) //push the error parameter along with error msg

    return res.status(422).json({errors:extractedErrors})
}