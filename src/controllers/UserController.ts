import UserModel from "../models/UserModel";
import WorkspaceModel from "../models/WorkspaceModel";

import { HTTP_STATUS } from "../lib/http_status";
import b from "../lib/default_animal_images.json";

import { User, UserDB } from "../types/userTypes";

import fetchOAuth from "../utils/fetch_oath";
import hashPass from "../utils/hash_password";

import jwt from "jsonwebtoken";
import { compare } from "bcrypt";


class UserController {

    private userModel: UserModel;
    private wkspModel: WorkspaceModel;

    constructor() {
        this.userModel = new UserModel();
        this.wkspModel = new WorkspaceModel();
    }

    async create(req, reply) {
        const { name, password, email, access_token } = req.body;
    
        try {
            if (!name || !email) {
                throw new Error('Missing data');
            }
        
            let passwordHash, pic;
            pic = b.animals[Math.floor(Math.random() * b.animals.length)];
            passwordHash = await hashPass(password);
        
            const data = {
                name,
                password: password ? passwordHash : null,
                email,
                icon: pic,
                status: 'active',
                accountType: 'free',
                planType: 'perMonth',
                paymentType: 'creditCard',
            };
        
            if (!data.password && !access_token) {
                throw new Error('Missing password or access_token');
            } else if (access_token) {
                const isValidToken = await fetchOAuth(access_token);
        
                if (!isValidToken) {
                    throw new Error('Invalid OAuthToken');
                } else {
                    const { name, email, picture } = isValidToken;
                    data.name = name;
                    data.email = email;
                    data.icon = picture;
                }
            }
    
        
            const userAlreadyExists = await this.userModel.getByEmail(email);
    
            if (userAlreadyExists) {
                throw new Error('User already exists');
            }
    
            const user = await this.userModel.create(data);
            // const workspace = await registerWorkspace(user.id);
            const token = jwt.sign({ user }, "secret", { expiresIn: '72h' });
    
            return reply.send({
                status: HTTP_STATUS.OK,
                message: 'User created',
                data: {
                    user: user,
                    token: token,
                },
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            console.log("Message:", errorMessage);
            return reply.send({
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: errorMessage
            });
        }
    }

    async authenticateUser(req, reply) {
        const { email, password } = req.body;
    
        if (!email || !password) {
            return reply.send({ message: 'Request is missing data.', status: HTTP_STATUS.BAD_REQUEST });
        }
    
        try {
            const user = await this.userModel.getByEmail(email);
    
            if (!user) {
                return reply.send({ message: 'User does not exists.', status: HTTP_STATUS.UNAUTHORIZED });
            }
    
            const passwordMatch = await compare(password, user.password);
    
            if (passwordMatch) {
                const token = jwt.sign({ user }, "secret", { expiresIn: '72h' });
                return reply.send({ user, status: HTTP_STATUS.OK, token });
            } else {
                return reply.send({ message: 'Invalid password.', status: HTTP_STATUS.UNAUTHORIZED });
            }
        } catch (error) {
            return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error', status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
        }
    }

    async authByGoogle(req, reply) {
        const { access_token } = req.body;
    
        if (!access_token) {
            return reply.status(HTTP_STATUS.BAD_REQUEST).send({ error: 'Request is missing data.' });
        }
    
        try {
            const isValidToken = await fetchOAuth(access_token);
    
            if (!isValidToken) {
                return reply.send({ error: 'Invalid OAuthToken', status: HTTP_STATUS.BAD_REQUEST });
            }
    
            const { email } = isValidToken;
            const user = await this.userModel.getByEmail(email);
    
            if (user) {
                const token = jwt.sign({ user }, "secret", { expiresIn: '72h' });
                return reply.send({ user, token: token, status: HTTP_STATUS.OK });
            } else {
                const { name, email, picture } = isValidToken;
                const userCreated = await this.userModel.create({
                    name,
                    email,
                    icon: picture,
                    status: 'active',
                    accountType: 'free',
                    planType: 'perMonth',
                    paymentType: 'creditCard'
                } as UserDB);
                
                const token = jwt.sign({ user: userCreated }, "secret", { expiresIn: '72h' });
    
                return reply.send({ user: userCreated, token: token, status: HTTP_STATUS.OK });
            }
        } catch (error) {
            console.error('Error:', error);
            return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
        }
    }

    async get(req, reply) {
    
        const { userId } = req.query;
    
        try {
            const user = await this.userModel.getById(userId);

            if (!user) throw new Error('User not found');
            else
                return reply.send({ user, status: HTTP_STATUS.OK });
        } catch (error:any) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            console.log("Message:", errorMessage);
            return reply.send({ message: errorMessage, status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
        }
    }
    
    async updateUser(req, reply) {

        const userReq = req.body as User;
    
        try {
            const user = await this.userModel.getByEmail(userReq.email);
    
            if (user) {
                const userUpdated = await this.userModel.update(userReq.email);
    
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

    async setUserTrashedStatus(req, reply) {
        const { userId } = req.query;
    
        try {
            const user = await this.userModel.getById(userId);
    
            if (!user) throw new Error('User not found');
            else {

                let status = !user.trash;

                const userUpdated = await this.userModel.delete(userId, status);

                if (!userUpdated) {
                    throw new Error('User not updated');
                } else {
                    return reply.send({
                        status: HTTP_STATUS.OK,
                        message: 'User moved to trash',
                    });
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            console.log("Message:", errorMessage);
            return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: errorMessage
            });
        }
    }

    async delete(req, reply) {
        const { userId } = req.query;
    
        try {
            const user = await this.userModel.getById(userId);
    
            if (!user) throw new Error('User not found');
            else {
                const workspace = await this.wkspModel.delete(userId);
                const userDeleted = await this.userModel.deletePermanently(userId);
    
                if (!userDeleted) {
                    throw new Error('User not deleted');
                } else {
                    return reply.send({
                        status: HTTP_STATUS.OK,
                        message: 'User deleted',
                    });
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            console.log("Message:", errorMessage);
            return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: errorMessage
            });
        }
    }
}

export default UserController;