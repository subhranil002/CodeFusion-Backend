import ApiError from "./ApiError.js";
const generateAccessAndRefreshToken = async (user) => {
    try {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new ApiError(`Something went wrong while generating tokens ${error}`, 500);
    }
};
export default generateAccessAndRefreshToken;
