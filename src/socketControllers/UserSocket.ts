import { Socket } from "socket.io";
import UserModel from "../models/UserModel";

const model = new UserModel();

class UserSocket {

    // async get(socket: Socket) {
    //     try {
    //         socket.on('getUser', async (req) => {
    //             const user = await model.getById(req.id);

    //             if (!user) 
    //                 throw new Error("User not found");
    //             else
    //                 socket.broadcast.emit('getUser', user);    
    //         });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    async update(socket: Socket) {
        try {
            socket.on('updateUser', async (req) => {
                const user = await model.getById(req.id);
                if (!user) 
                    throw new Error("User not found");
                else {
                    const userUpdated = await model.update(req);
    
                    socket.broadcast.emit('updateUser', userUpdated);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
}

export default UserSocket;