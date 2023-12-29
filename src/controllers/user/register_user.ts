import b from "../../lib/animals-image.json";
import jwt from "jsonwebtoken";

import { RegisterUser } from "../../types/userTypes";

import findUser from "../../models/find_user";
import createUser from "../../models/create_user";
import hashPass from "./hash_pass";

export default async function registerUser(req, res) {

    const { name, password, email, icon } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            status: 400,
            message: 'Missing data'
        });
    } else {
        var hashedPassword = hashPass(password);
        var pic = icon ? icon : b.animals[Math.floor(Math.random() * b.animals.length)];

        const data = {
            name: name,
            password: hashedPassword,
            email: email,
            icon: pic,
            status: 'active',
            accountType: 'free',
            planType: 'perMonth',
            paymentType: 'creditCard'
        };

        try {
            const userAlreadyExists = await findUser(email);

            if (userAlreadyExists) {
                return {
                    status: 409,
                    message: 'User already exists'
                };
            } else {
                const user = await createUser({
                    ...data,
                    password: await hashedPassword
                } as RegisterUser);

                jwt.sign({ user }, "secret", { expiresIn: '72h' }, (err, token) => {
                    if (token) {
                        console.log(token);
                        return res.status(200).json({
                            status: 200,
                            message: 'User created successfully',
                            token: token
                        });
                    } else {
                        return res.status(500).json({
                            status: 500,
                            message: 'JWT error'
                        });
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