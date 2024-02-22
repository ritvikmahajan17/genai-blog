// import { getSession } from "@auth0/nextjs-auth0";
// import clientPromise from "../lib/mongodb";

// export default async function getAppProps(context) {
//     const {user} = await getSession(context.req, context.res);

//     console.log(user)

//     const client = await clientPromise;
//     const db = client.db("genaiBlog");
//     const currUser = await db.collection('users').findOne(
//         {
//             auth0Id: user.sub,
//         }
//     );
//     const posts = await db.collection('posts').find({
//         user: currUser._id
//     }).toArray();

//     return {
//         props: {
//             posts,
//             availableTokens: currUser.availableTokens
//         }
//     }
// }

