import { prisma } from "../database/prisma-client";

class DatahubModel {

    async create(title:string) {
        const datahub = await prisma.dataHub.create({
            data: {
                title: title ? title : "Sem título"
            }
        });

        return datahub;
    }
}

export default DatahubModel;