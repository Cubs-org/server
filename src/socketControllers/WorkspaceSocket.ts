import { Socket } from "socket.io";
import UserModel from "../models/UserModel";
import WorkspaceModel from "../models/WorkspaceModel";

const model = new UserModel();
const wkspModel = new WorkspaceModel();

class WorkspaceSocket {

    async getPagesByMemberId(socket: Socket) {

        try {
            socket.on('getPagesByMemberId', async (req) => {
                
                const user = await model.getByEmail(req.email);
                if (!user) throw new Error("User not found");
                
                const pages = await wkspModel.getPagesByMemberId(user?.id as string);
                socket.emit('getPagesByMemberId', pages);
            });
        } catch (error) {
            console.log(error);
        }
    }

    async tagsTest(socket: Socket) {

        try {
            socket.on('tagsTest', async (req) => {
                console.log('received: ', req);
                socket.emit('tagsTest', { message: 'Hello from server' });
            });
        } catch (error) {
            console.log(`:CubsServer\n(tagsTest)Error: ${JSON.stringify(error)}`);
        }
    }
}

export default WorkspaceSocket;