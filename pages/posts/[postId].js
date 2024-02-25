import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import AppLayout from "../../components/AppLayout/AppLayout"
import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import Markdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";


export default function Post(props) {

    return (
        <div className="flex overflow-scroll justify-center items-center px-3 py-2 ">
            <div className="h-screen w-1/2 flex flex-col gap-4">
                <div>
                    <div className="bg-stone-200 h-10 pl-3 flex items-center rounded-sm font-bold">SEO title & Meta-Description</div>
                    <div className="px-2 mt-3 border border-neutral-300">
                        <div className="font-bold text-lg font-heading py-4">{props.title}</div>
                        <div >{props.metaDescription}</div>
                    </div>
                </div>
                <div className="flex flex-col gap-y-2">
                    <div className="bg-stone-200 h-10 pl-3 flex items-center rounded-sm font-bold">Keywords</div>
                    <div className="flex gap-x-2">
                        {props.keywords.split(',').map((keyword, index) => {
                            return (
                                <div key={index} className="bg-blue-900 rounded-3xl min-h-full flex  items-center text-md w-100 gap-x-1 p-2">
                                    <FontAwesomeIcon icon={faHashtag} color="white" />
                                    <div className="text-white">{keyword}</div>
                                </div>
                            )
                        }
                        )}
                    </div>
                </div>
                <div>
                    <div className="bg-stone-200 h-10 pl-3 flex items-center rounded-sm font-bold">Blog Post</div>
                    <Markdown className="px-2">{props.postContent}</Markdown>
                </div>
            </div>
        </div>
    )
}

Post.getLayout = function getLayout(page, pageProps) {
    return (
        <AppLayout {...pageProps}>
            {page}
        </AppLayout>
    )
}


export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(context) {
        const { params } = context;
        const { postId } = params;

        const { user } = await getSession(context.req, context.res);
        const client = await clientPromise;
        const db = client.db("genaiBlog");

        const currUser = await db.collection('users').findOne(
            {
                auth0Id: user.sub,
            }
        );

        const post = await db.collection('posts').findOne(
            {
                _id: new ObjectId(postId),
                user: currUser._id
            },
        );

        const allPosts = await db.collection('posts').find
            ({
                user: currUser._id
            }).toArray();

        allPosts?.forEach(post => {
            post._id = post?._id.toString()
            post.user = post?.user.toString()
            post.createdAt = post?.createdAt.toString()
        }
        )

        return {
            props: {
                postContent: post?.postContent || "",
                title: post?.title|| "",
                metaDescription: post?.metaDescription|| "",
                keywords: post?.keywords || "",
                posts: allPosts,
                postId:postId,
                availableTokens: currUser.availableTokens
            }
        }
    }
})