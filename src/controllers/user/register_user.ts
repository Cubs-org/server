import { User } from ".";

import bcrypt from "bcrypt";

import b from "../../lib/animals-image.json";
import { prisma } from "../../lib/prisma";

import { RegisterUser } from "../../types/userTypes";

import CreateUser from "../../models/user/CreateUser"

class UserController extends User {

    async registerUser(req, res) {

        const { name, password, email, icon } = req.body;

        let hashedPassword;
        if (this.password) {
            hashedPassword = await bcrypt.hash(password, 10);
        } else {
            hashedPassword = null;
        }

        let pic = icon ? 
                    icon :
                    b.animals[Math.floor(Math.random() * b.animals.length)];

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
            const createUser = new CreateUser();
            const userAlreadyExists = await createUser.findUser();

            if (userAlreadyExists) {
                return {
                    status: 409,
                    message: 'User already exists'
                };
            } else {
                const user = await prisma.user.create({
                    data: {
                        ...data as RegisterUser
                    }
                });

                return user;
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

export default UserController;