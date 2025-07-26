//NPM
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import nodemailer from "nodemailer";

//Models
import userModel from "../../models/users.js";

//Helpers & Utils
import logger from '../../../logger.js';
import { createJwtToken, getMessage } from "../../helper/common/helpers.js";
import ResponseHelper from "../../helper/common/responseHelper.js";
import { HttpStatus } from "../../helper/common/constant.js";
import { generateUsername, emailExist } from "./service.js";
import userResponse from "../../response/userResponse.js";

/**
 * Register a new user
 */
export const userRegister = async (req, res) => {
    try {
        const { language = "en", firstName, lastName, email, password, address, age, gender } = req.body;

        logger.info(`userRegister : Req body==>> ${JSON.stringify(req.body)}`);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ResponseHelper.error(res, HttpStatus.BAD_REQUEST, language, errors.errors[0]["msg"], null);
        }

        // Check if email exists
        const existingEmail = await emailExist(email.toLowerCase());
        if (existingEmail) {
            return ResponseHelper.error(res, HttpStatus.BAD_REQUEST, language, 'Email_Already_Exist', null);
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        //user name 
        const userName = await generateUsername(firstName, lastName);

        const user = new userModel({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            address,
            age,
            gender,
            userName
        });

        const savedUser = await user.save();

        // Send registration email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: savedUser.email,
            subject: 'Registration Successful',
            text: `Welcome ${savedUser.firstName}, your registration was successful!`
        });

        const token = await createJwtToken({ id: savedUser._id });
        return ResponseHelper.success(res, HttpStatus.CREATED, language, 'User_Register_Success', null, token);

    } catch (error) {
        logger.error("userRegister Error ==>> " + error);
        return ResponseHelper.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 'en', 'Register_Failed', error.message);
    }
};

/**
 * User login
 */
export const userLogin = async (req, res) => {
    try {
        const { email, password, language = "en" } = req.body;

        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return ResponseHelper.error(res, HttpStatus.UNAUTHORIZED, language, 'Invalid_Credentials', null);
        }

        const token = await createJwtToken({ id: user._id });
        return ResponseHelper.success(res, HttpStatus.OK, language, 'User_Login_Success', new userResponse(user), token);

    } catch (error) {
        logger.error("userLogin Error ==>> " + error);
        return ResponseHelper.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 'en', 'Login_Failed', error.message);
    }
};

/**
 * Get logged-in user's detail
 */
export const getUserDetail = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        if (!user) return ResponseHelper.error(res, HttpStatus.NOT_FOUND, 'en', 'User_Not_Found', null);

        return ResponseHelper.success(res, HttpStatus.OK, 'en', 'User_Detail_Fetched', user);
    } catch (error) {
        logger.error("getUserDetail Error ==>> " + error);
        return ResponseHelper.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 'en', 'Fetch_Error', error.message);
    }
};

/**
 * @Method Used for change password
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const changePassword = async (req, res) => {
    try {
        const { language, oldPassword, newPassword } = req.body;
        //decoded user id
        const userId = req.user.id; // Get user ID from auth middleware

        logger.info(`changePassword : userId ==>> ${userId} AND req body ==>> ${JSON.stringify(req.body)}`);

        // Find user
        const user = await getUserById(userId);
        if (!user) {
            return ResponseHelper.error(res, HttpStatus.BAD_REQUEST, language, 'User_Not_Found', null);
        }

        //if old and new password are same. than throw error
        if (oldPassword === newPassword) {
            return ResponseHelper.error(res, HttpStatus.BAD_REQUEST, language, 'Old_New_Both_Password_Same', null);
        }

        // Check if old password is correct
        const isMatch = bcrypt.compareSync(oldPassword, user.password);
        if (!isMatch) {
            return ResponseHelper.error(res, HttpStatus.BAD_REQUEST, language, 'Old_Password_Incorrect', null);
        }

        //update new passowrd in DB
        await userModel.updateOne(
            { _id: userId },
            {
                $set: {
                    password: bcrypt.hashSync(newPassword, 10)
                }
            }
        )

        logger.info("#### **** changePassword : Password change successfully ****####");
        return ResponseHelper.success(res, HttpStatus.OK, language, 'Password_Chnage_Success', null, null);

    } catch (error) {
        logger.error("changePassword : Error==>> " + error);
        return ResponseHelper.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 'en', 'Internal_Server_Error', error.message);
    }
};

/**
 * Update user detail
 */
export const updateUserDetail = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, address, age, gender } = req.body;
        //user name 
        const userName = await generateUsername(firstName, lastName);

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: { firstName, lastName, address, age, gender, userName } },
            { new: true }
        );

        if (!updatedUser) return ResponseHelper.error(res, HttpStatus.NOT_FOUND, 'en', 'User_Not_Found', null);

        return ResponseHelper.success(res, HttpStatus.OK, 'en', 'Update_User_Details', updatedUser);
    } catch (error) {
        logger.error("updateUserDetail Error ==>> " + error);
        return ResponseHelper.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 'en', 'Field_Update_User_Details', error.message);
    }
};

/**
 * Delete user by ID
 */
export const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const deletedUser = await userModel.findByIdAndDelete(userId);

        if (!deletedUser) return ResponseHelper.error(res, HttpStatus.NOT_FOUND, 'en', 'User_Not_Found', null);

        return ResponseHelper.success(res, HttpStatus.OK, 'en', 'User_Deleted_Success', null);
    } catch (error) {
        logger.error("deleteUser Error ==>> " + error);
        return ResponseHelper.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 'en', 'Delete_Failed', error.message);
    }
};

/**
 * Logout user
 */
export const userLogOut = async (_req, res) => {
    try {
        return ResponseHelper.success(res, HttpStatus.OK, 'en', 'Logout_Success', null);
    } catch (error) {
        logger.error("userLogOut Error ==>> " + error);
        return ResponseHelper.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 'en', 'Logout_Failed', error.message);
    }
};


/**
 * @Method Method used to get all user list with filter and pagination
 * @param {*} req 
 * @param {*} res 
 * @date 26-JULY-2025
 */
export const getUserList = async (req, res) => {
    try {
        const { language, search, page = 1, perPage = 10 } = req.body;

        //pagination
        const pageNo = (page - 1) * perPage;

        let filter = {};
        //search filter
        if (search) {
            const reg = {
                $or: [
                    { firstName: { $regex: ".*" + search + ".*", $options: "i" } },
                    { lastName: { $regex: ".*" + search + ".*", $options: "i" } }
                ]
            };

            filter = Object.assign(filter, reg);
        }

        //get user list
        const getAllUsers = await userModel.find(filter)
            .sort({ _id: -1 })
            .skip(pageNo)
            .limit(perPage);

        if (getAllUsers && getAllUsers.length) {
            const madeUserResponse = await Promise.all(getAllUsers.map(async (user) => {
                return new userResponse(user);
            })//map
            )//promise

            //get total count
            const totalCount = await userModel.countDocuments(filter);

            return res.status(200).send({
                status: true,
                message: await getMessage(language, "User_List_Fetched_Success"),
                totalCount: totalCount,
                data: madeUserResponse,

            })
        } else {
            return res.send({
                status: false,
                message: await getMessage(language, "Data_Not_Found"),
                data: []
            })
        }

    } catch (error) {

        return res.status(500).send({
            status: false,
            message: error.message,
        })
    }
}