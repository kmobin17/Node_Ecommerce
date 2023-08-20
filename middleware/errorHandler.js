import { DEBUG_MODE } from "../config"
import {ValidationError} from 'joi'
import CustomErrorHandler from "../services/CustomErrorHandler"


const errorHandler = (err, req, res, next) => {
    let statusCode = 500
    const data = {
        message : 'Internal Server Error',
        ...(DEBUG_MODE && {originalError: err.message})
    }

    if(err instanceof ValidationError){
        statusCode = 409
        data.message = err.message
    }
    if(err instanceof CustomErrorHandler){
        statusCode = 402
        data.message = err.message
    }


    return res.status(statusCode).json(data)
}

export default errorHandler