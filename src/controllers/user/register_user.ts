import b from "../../lib/animals-image.json";
import jwt from "jsonwebtoken";

import { RegisterUser } from "../../types/userTypes";

import hashPass from "./hash_pass";

import createUser from "../../models/user/create_user";
import { findUserByEmail } from "../../models/user/find_user";
import registerWorkspace from "../workspace/register_workspace";
import { updateUserById } from "../../models/user/update_user";

export default async function registerUser(req, res) {

    const { name, password, email, icon } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            status: 400,
            message: 'Missing data'
        });
    } else {
        var pic = icon ? icon : b.animals[Math.floor(Math.random() * b.animals.length)];

        const data = {
            name: name,
            password: password ? hashPass(password) : null,
            email: email,
            icon: pic,
            status: 'active',
            accountType: 'free',
            planType: 'perMonth',
            paymentType: 'creditCard'
        };

        try {
            const userAlreadyExists = await findUserByEmail(email);

            if (userAlreadyExists) {
                return {
                    status: 409,
                    message: 'User already exists'
                };
            } else {
                const user = await createUser({
                    ...data
                } as RegisterUser);

                const workspace = await registerWorkspace(user.id);

                const token = jwt.sign({ user, workspace }, "secret", { expiresIn: '72h' });

                const userUpdated = await updateUserById(
                    {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        icon: user.icon,
                        accessToken: token,
                    }
                );

                return res.status(200).send({
                    status: 200,
                    message: 'User created',
                    data: {
                        user: userUpdated,
                        workspace: workspace,
                        token: token
                    }
                });
            }
        } catch (error) {
            console.log(error);
            return {
                status: 500,
                message: 'Internal server error'
            };
        }
    }
}