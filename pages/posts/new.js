import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import AppLayout from "../../components/AppLayout/AppLayout"
import { useState } from "react"
import { useRouter } from "next/router"
import clientPromise from "../../lib/mongodb"
import { ObjectId } from "mongodb"
import { CSSProperties } from "react";
import {ScaleLoader} from "react-spinners"


export default function NewPost() {

    const [topic, setTopic] = useState('')
    const [keywords, setKeywords] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({
        topic: false,
        keywords: false

    })
    const router = useRouter()

    const handleGeneratePost = async () => {


        setError({
            topic: !topic,
            keywords: !keywords
        })

        if (!topic || !keywords) {
            return
        }

        setLoading(true)
        const res = await fetch('/api/generatePost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topic,
                keywords
            })
        })

        const data = await res.json()
        const { postId } = data
        setLoading(false)

        if (!postId) {
            return
        }

        router.push(`/posts/${postId}`)

    }

    return (
        <div className="bg-gray-200 p-5 flex flex-col gap-4 items-center w-96 rounded-md">
            <h1>Generate New Post</h1>
            <div className="flex flex-col">
                <label htmlFor="title"><span>Topic</span>{error.topic && <span className="text-red-500 ml-2 text-sm">Fill pls</span>}</label>
                <input onChange={(e) => {
                    setTopic(e.target.value)
                }} className="rounded-sm pl-1" name="title" type="text" placeholder="Title" value={topic} />
            </div>
            <div className="flex flex-col">
                <label htmlFor="keywords"><span>Keywords (comma seperated)</span>{error.keywords && <span className="text-red-500 ml-2 text-sm">Fill pls</span>}</label>
                <input onChange={(e) => { setKeywords(e.target.value) }} className="rounded-sm pl-1" name="keywords" type="text" placeholder="Keywords" value={keywords} />
            </div>
            <ScaleLoader color="#4A5568" loading={loading}  />
            {!loading && <button className="h-10 bg-green-500 w-48 rounded" onClick={handleGeneratePost}>Generate Post
            </button>}
        </div>
    )
}

NewPost.getLayout = function getLayout(page, pageProps) {
    return (
        <AppLayout {...pageProps}>
            {page}
        </AppLayout>
    )
}


export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(context) {

        const { user } = await getSession(context.req, context.res);

        const client = await clientPromise;
        const db = client.db("genaiBlog");
        const currUser = await db.collection('users').findOne(
            {
                auth0Id: user.sub,
            }
        );

        if (!currUser) {
            return {
                props: {
                    posts: [],
                    availableTokens: 10
                }
            }
        }

        const posts = await db.collection('posts').find({
            user: new ObjectId(currUser?._id)
        })?.toArray();


        if (!posts) {
            return {
                props: {
                    posts: [],
                    availableTokens: currUser.availableTokens
                }
            }
        }
        posts.forEach(post => {
            post._id = post?._id.toString()
            post.user = post?.user.toString()
            post.createdAt = post?.createdAt.toString()
        }
        )

        return {
            props: {
                posts,
                availableTokens: currUser.availableTokens
            }
        }
    }
})