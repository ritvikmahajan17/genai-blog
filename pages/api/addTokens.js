import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {

    const session = await getSession(req, res);
    const { user } = session;

    const client = await clientPromise;
    const db = client.db("genaiBlog");
    await db.collection('users').updateOne(
        {
            auth0Id: user.sub,
        },
        {
            $inc: {
                availableTokens: 10
            },

            $setOnInsert: {
                auth0Id: user.sub,
            }
        },
        {
            upsert: true
        }
    );
}

