import { checkSchema, validationResult } from "express-validator";


export const registerationInputValidator = checkSchema(
    {
        username: {
            notEmpty: {
                errorMessage:"Username is required",
            },
            isString:{
                errorMessage:"Username should be strictly string",
            },
            isLength:{
                options:{
                    max:25
                },
                errorMessage:"Username too lengthy"
            },
            trim:true,
        },
        email: {
            notEmpty: {
                errorMessage:"Email is required",
            },
            isEmail:{
                errorMessage:"Invalid Email",
            }
        },
        password:{
            notEmpty:{
                errorMessage:"Password is required"
            },
            isLength:{
                options:{
                    min:4
                },
                errorMessage:"Password too short"
            }
        },
        fullName:{
            notEmpty:{
                errorMessage:"Fullname is required"
            },
            isString:{
                errorMessage:"Fullname should be strictly string",
            }
        }
    }
)


export const loginInputValidator = checkSchema(
    {
        identity: {
            notEmpty: {
               errorMessage:"Username/Email is required",
            },
            isString:{
                errorMessage:"Username should be strictly string",
            },
        },
        password:{
            notEmpty:{
                errorMessage:"Password is required"
            },
            isLength:{
                options:{
                    min:4
                },
                errorMessage:"Password too short"
            }
        }
    }
)


export const inputValidationError = (req,res,next) =>{
    const errors  = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            "success" : false,
            "message" : "Input not valid",
            "error" : errors.array()
        })
    }
    next()
}