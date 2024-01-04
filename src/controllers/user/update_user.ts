import { findUserByEmail } from "../../models/user/find_user";
import { updateUserByEmail } from "../../models/user/update_user";

type userRequest = {
    body: {
        name?: string,
        email: string,
        password?: string,
        icon?: string,
        accessToken?: string
    }
};

async function updateUser(req, res) {

    const dataReq = req.body as userRequest['body'];

    try {
        const user = await findUserByEmail(dataReq.email);

        if (user) {

            const userUpdated = await updateUserByEmail(dataReq)

            if (userUpdated) {

                res.status(200).json({
                    message: "User updated successfully",
                    user: userUpdated
                });

            } else {

                res.status(500).json({
                    message: "User not updated"
                });

            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default updateUser;