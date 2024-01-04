import { HTTP_STATUS } from "../lib/http_status";
import { findUserByEmail } from "../models/model.user.find";
import { updateUserByEmail } from "../models/model.user.update";
import { User } from "../types/userTypes";

async function updateUser(req, res) {

    const userReq = req.body as User;

    try {
        const user = await findUserByEmail(userReq.email);

        if (user) {
            const userUpdated = await updateUserByEmail(userReq.email);

            if (userUpdated) {
                res.status(HTTP_STATUS.OK).json({
                    message: "User updated successfully",
                    user: userUpdated,
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    message: "User not updated",
                });
            }
        } else {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message: "User not found",
            });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            error: 'Internal server error',
        });
    }
}

export default updateUser;