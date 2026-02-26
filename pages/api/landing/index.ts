import { prisma } from "@/lib/prisma";
import { NextApiRequest } from "next";

export default async function handler(
req: NextApiRequest,
res: NextApiRequest
){
    if (req.method === "GET") {
        try {
            const response = await prisma.
        } catch (error) {
            console.log("error")
        }
    }
}