import { Socket } from "socket.io";
import { findUserById } from "../models/model.user.find";
import { updateUserById } from "../models/model.user.update";

async function getUser(socket: Socket) {
    try {
        socket.on('setUser', async (req) => {
            const user = await findUserById(req.id) as any;
            if (!user) throw new Error("User not found");
            else {
                const userUpdated = await updateUserById(req);

                socket.broadcast.emit('getUser', userUpdated);
            }
        });
    } catch (error) {
        console.log(error);
    }
}

export default getUser;