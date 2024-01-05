import { HTTP_STATUS } from "../lib/http_status";
import { findUserByEmail } from "../models/model.user.find";
import { updateUserByEmail } from "../models/model.user.update";
import { User } from "../types/userTypes";

async function updateUser(req, reply) {

    const userReq = req.body as User;

    try {
        const user = await findUserByEmail(userReq.email);

        if (user) {
            const userUpdated = await updateUserByEmail(userReq.email);

            if (userUpdated) {
                reply.status(HTTP_STATUS.OK).send({
                    message: "User updated successfully",
                    user: userUpdated,
                });
            } else {
                reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
                    message: "User not updated",
                });
            }
        } else {
            reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
                message: "User not found",
            });
        }
    } catch (error) {
        console.error('Error:', error);
        reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            error: 'Internal server error',
        });
    }
}

export default updateUser;