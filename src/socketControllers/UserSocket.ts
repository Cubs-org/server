import { Socket } from "socket.io";
import UserModel from "../models/UserModel";
import WorkspaceModel from "../models/WorkspaceModel";

const model = new UserModel();
const wkspModel = new WorkspaceModel();

class UserSocket {

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

    async getPagesByMemberId(socket: Socket) {

        try {
            socket.on('getPagesByMemberId/emit', async (req) => {
                const pages = await wkspModel.getPagesByMemberId(req.id);
                socket.emit('getPagesByMemberId/on', pages);
            });
        } catch (error) {
            console.log(error);
        }
    }
}

export default UserSocket;