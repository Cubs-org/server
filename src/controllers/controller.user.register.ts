import b from "../lib/default_animal_images.json";
import jwt from "jsonwebtoken";
import { RegisterUser } from "../types/userTypes";
import hashPass from "../utils/hash_password";
import createUser from "../models/model.user.create";
import { findUserByEmail } from "../models/model.user.find";
import registerWorkspace from "./controller.workspace.create";
import { updateUserById } from "../models/model.user.update";
import { HTTP_STATUS } from "../lib/http_status";
import fetchOAuth from "../utils/fetch_oath";

export default async function registerUser(req, reply) {
    const { name, password, email, icon, access_token } = req.body;

    if (!name || !email) {
        return reply.status(HTTP_STATUS.BAD_REQUEST).send({
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
        return reply.status(HTTP_STATUS.BAD_REQUEST).send({
            status: HTTP_STATUS.BAD_REQUEST,
            message: 'Missing password or access_token',
            data: data,
        });
    } else if (access_token) {
        const isValidToken = await fetchOAuth(access_token);

        if (!isValidToken) {
            return reply.status(HTTP_STATUS.BAD_REQUEST).send({
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
        const userAlreadyExists = await findUserByEmail(email);

        if (userAlreadyExists) {
            return reply.status(HTTP_STATUS.CONFLICT).send({
                status: HTTP_STATUS.CONFLICT,
                message: 'User already exists',
            });
        }

        const user = await createUser(data as RegisterUser);
        const workspace = await registerWorkspace(user.id);
        const token = jwt.sign({ user, workspace }, "secret", { expiresIn: '72h' });

        const userUpdated = await updateUserById({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            icon: user.icon,
            accessToken: token,
        });

        return reply.status(HTTP_STATUS.OK).send({
            status: HTTP_STATUS.OK,
            message: 'User created',
            data: {
                user: userUpdated,
                workspace,
                token,
            },
        });
    } catch (error) {
        console.error('Error:', error);
        return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
        });
    }
}
