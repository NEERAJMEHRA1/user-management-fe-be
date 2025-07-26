import { body } from "express-validator";

export const validator = (method) => {
    switch (method) {
        case "registerValidation": {
            return [
                body("email", "Email_Id_Required").not().notEmpty(),
                body("password", "Password_Is_Required").not().notEmpty(),
                body("firstName", "User_Name_Required").not().notEmpty(),
                body("lastName", "User_Name_Required").not().notEmpty(),
            ]
        }

        case "updateValidation": {
            return [
                body("firstName", "User_Name_Required").not().notEmpty(),
                body("lastName", "User_Name_Required").not().notEmpty(),
            ]
        }

        default:
            return "Somethong wan't wrong."
            break;
    }
}