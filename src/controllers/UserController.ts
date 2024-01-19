import { HTTP_STATUS } from "../lib/http_status";
import UserModel from "../models/UserModel";
import { User, UserDB } from "../types/userTypes";
import fetchOAuth from "../utils/fetch_oath";
import hashPass from "../utils/hash_password";
import b from "../lib/default_animal_images.json";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";

const model = new UserModel();

class UserController {

    async create(req, reply) {
        const { name, password, email, access_token } = req.body;
    
        if (!name || !email) {
            return reply.send({
                status: HTTP_STATUS.BAD_REQUEST,
                message: 'Missing data',
            });
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
            return reply.send({
                status: HTTP_STATUS.BAD_REQUEST,
                message: 'Missing password or access_token'
            });
        } else if (access_token) {
            const isValidToken = await fetchOAuth(access_token);
    
            if (!isValidToken) {
                return reply.send({
                    status: HTTP_STATUS.BAD_REQUEST,
                    message: 'Invalid access_token',
                });
            } else {
                const { name, email, picture } = isValidToken;
                data.name = name;
                data.email = email;
                data.icon = picture;
            }
        }
    
        try {
            const userAlreadyExists = await model.getByEmail(email);
    
            if (userAlreadyExists) {
                return reply.send({
                    status: HTTP_STATUS.CONFLICT,
                    message: 'User already exists',
                });
            }
    
            const user = await model.create(data);
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
            return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            });
        }
    }

    async authenticateUser(req, reply) {
        const { email, password } = req.body;
    
        if (!email || !password) {
            return reply.send({ message: 'Request is missing data.', status: HTTP_STATUS.BAD_REQUEST });
        }
    
        try {
            const user = await model.getByEmail(email);
    
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
            const user = await model.getByEmail(email);
    
            if (user) {
                const token = jwt.sign({ user }, "secret", { expiresIn: '72h' });
                return reply.send({ user, token: token, status: HTTP_STATUS.OK });
            } else {
                const { name, email, picture } = isValidToken;
                const userCreated = await model.create({
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
            const user = await model.getById(userId);
    
            return reply.send({ user, status: HTTP_STATUS.OK });
        } catch (error) {
            return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
        }
    }
    
    async updateUser(req, reply) {

        const userReq = req.body as User;
    
        try {
            const user = await model.getByEmail(userReq.email);
    
            if (user) {
                const userUpdated = await model.update(userReq.email);
    
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
}

export default UserController;