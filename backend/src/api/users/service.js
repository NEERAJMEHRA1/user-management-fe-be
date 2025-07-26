import userModel from "../../models/users.js";

/**
 * @Method Method used for get user data by email
 * @author Neeraj-Mehra
 * @param {*} email 
 * @date 26-JULY-2025
 */
export const emailExist = async (email) => {
    try {
        //get user data by email
        const getUserData = await userModel.findOne({ email: email }).lean();

        if (getUserData) {
            return true;
        }
        return false;

    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * @Method Method used for get user data by id
 * @author Neeraj-Mehra
 * @param {*} userId 
 * @date 26-JULY-2025
 */
export const getUserById = async (userId) => {
    try {

        //get user data
        const userData = await userModel.findOne({ _id: userId }).lean();

        return userData;

    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * @Method method used to get user by email
 * @param {*} email 
 * @date 26-JULY-2025
 */
export const getUserByEmail = async (email) => {
    try {
        //get user by email
        const getUser = await userModel.findOne({ email: email });
        return getUser;

    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * @Method method used to get username by first name and last name
 * @date 26-JULY-2025
 */
export const generateUsername = async (firstName, lastName) => {
    const fn = firstName.trim().slice(0, 2).toLowerCase();
    const ln = lastName.trim().slice(0, 2).toLowerCase();
    return fn + ln;
}

