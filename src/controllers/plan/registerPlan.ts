import { prisma } from "../../lib/prisma";

export default async function registerPlan() {
    const plan = await prisma.plan.create({
        data: {
            accountType: "free",
            planType: "perMonth",
            paymentType: "creditCard"
        }
    });

    return plan;
}