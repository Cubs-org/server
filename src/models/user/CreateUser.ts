import { User } from "../../controllers/user";
import { prisma } from "../../lib/prisma";
import { Account } from "../../types/accountTypes";
import { RegisterUser } from "../../types/userTypes";

class CreateUser extends User {
    
    status:string = 'active';
    accountType:string = 'free';
    planType:string = 'perMonth';
    paymentType:string = 'creditCard';

    async findUser() {
        const user = await prisma.user.findUnique({
            where: {
                email: this.email
            }
        });

        return user;
    }

    async create() {

        const data = {
            name: this.name,
            password: this.password,
            email: this.email,
            icon: this.icon,
            status: this.status,
            accountType: this.accountType,
            planType: this.planType,
            paymentType: this.paymentType
        };

        try {
            const userAlreadyExists = await this.findUser();
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
            console.error(error);
            return error;
        }
    }
}

export default CreateUser;