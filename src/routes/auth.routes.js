import { Router } from "express"
import passport from "../config/passport.js"
import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"

const router = Router()


router.get("/google", 
              passport.authenticate("google",{
              scope: ["profile", "email"],
              session:false,
              prompt:"select_account"
})
)

router.get("/google/callback", 
              passport.authenticate("google",{
              
              session:false,
              failureRedirect:"/"
}),

async(req,res) => {
              // console.log(req.user)
              // res.json({user: req.user})

              const user = req.user
              const email = user.emails[0].value

              const isUserExist = userModel.findOne({ email })

              if(!isUserExist) {
                            const token = jwt.sign({ id: isUserExist._id}, process.env.JWT_SECRET, {expiresIn:"1h"})
                           return res.status(200).json({token})
              }

const newUser = await userModel.create({
              fullname:user.displayName,
              email,
              googleId: user.id
})

const token = jwt.sign({id: isUserExist._id}, process.env.JWT_SECRET, {expiresIn: "1h"})
//const refreshToken = jwt.sign({id: isUserExist._id}, process.env.JWT_SECRET, {expiresIn:"7d"})

return res.status(201).json({token})
})

export default router