import b from "../lib/default_animal_images.json";
import jwt from "jsonwebtoken";
import { RegisterUser } from "../types/userTypes";
import hashPass from "../utils/hash_password";
import createUser from "../models/model.user.create";
import { findUserByEmail } from "../models/model.user.find";
import registerWorkspace from "./controller.workspace.create";
import { updateUserById } from "../models/model.user.update";
import { HTTP_STATUS } from "../lib/http_status";

export default async function registerUser(req, res) {
    const { name, password, email, icon } = req.body;

    if (!name || !email) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            status: HTTP_STATUS.BAD_REQUEST,
            message: 'Missing data',
        });
    }

    const pic = icon || b.animals[Math.floor(Math.random() * b.animals.length)];

    const data = {
        name,
        password: password ? hashPass(password) : null,
        email,
        icon: pic,
        status: 'active',
        accountType: 'free',
        planType: 'perMonth',
        paymentType: 'creditCard',
    };

    try {
        const userAlreadyExists = await findUserByEmail(email);

        if (userAlreadyExists) {
            return res.status(HTTP_STATUS.CONFLICT).json({
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

        return res.status(HTTP_STATUS.OK).json({
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
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
        });
    }
}
