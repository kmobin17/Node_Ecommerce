import Joi from 'joi'
import { User } from '../../models'
import bcrypt from 'bcrypt'
import CustomErrorHandler from '../../services/CustomErrorHandler'
import JwtService from '../../services/JwtService'


const registerController = {
    async register(req, res, next) {

          // CHECKLIST
        // [ ] validate the request
        // [ ] check if user is in the database already
        // [ ] prepare model
        // [ ] store in the db
        // [ ] generate jwt token
        // [ ] send response

     
        const userSchema = Joi.object({
            email: Joi.string().email().required(),
            name: Joi.string().min(3).max(30).required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password')
        })

        try{
            const {error} = await userSchema.validate(req.body)
            if(error){
                return next(error)
            }
        }catch(e){
            return next(e)
        }


        try{
            const exist = await User.exists({email : req.body.email})
            if(exist)
                return next(CustomErrorHandler.alreadyExist('User already exists'))
        }catch(e){
            return next(e)
        }

        let access_token
            const {name, email, password} = req.body
            const user = new User({
                name,
                email,
                password: await bcrypt.hash(password,10)
            })
        try{
            const result = await user.save()

            access_token = JwtService.sign({_id: result._id, role: result.role})
                
        }catch(e){
            return next(e)
        }
        res.json({access_token})
    }
}

export default registerController