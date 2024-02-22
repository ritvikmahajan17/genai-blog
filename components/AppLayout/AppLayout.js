import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import Link from "next/link";
import Logo from "../Logo/Logo";
import { useRouter } from "next/router";

export default function AppLayout({ children, ...rest }) {

    const currPostId = rest.postId;
    const {availableTokens} = rest;

    const postList = rest.posts;
    const router = useRouter();

    const handleAddTokens = async () => {
        const response = await fetch("/api/addTokens", {
            method: "POST"
        });
        const data = await response.json();
    }

    const handlePostListClick = async (id) => {
        router.push(`/posts/${id}`);
    }

    const handleNewClick = async () => {
        router.push(`/posts/new`);
    }


    const { user } = useUser();
    return (
        <div className="flex h-screen">
            <div className="w-1/4 pb-3 text-white flex flex-col justify-between bg-gradient-to-b from-slate-800 to-cyan-800">
                <div className="flex px-3 flex-col items-center overflow-scroll gap-y-3">
                    <div className="flex flex-col items-center gap-y-1 justify-center">
                        <Logo />
                        <button onClick={handleNewClick} className="h-10 bg-green-500 w-48 rounded">New post</button>
                        <div className="cursor-pointer" onClick={handleAddTokens}>{availableTokens} tokens left</div>
                    </div>
                    <div className="flex flex-col gap-y-2 overflow-scroll">
                        {
                            !!postList && postList.map((post, index) => {
                                return (
                                    <div key={index} onClick={() => handlePostListClick(post._id)} className={`bg-gray-500 cursor-pointer p-2 w-100 rounded-md ${currPostId === post._id ? "border border-white":""}`}>
                                        {post.title}
                                    </div>
                                )
                            }
                            )
                        }
                    </div>
                </div>
                <div className="border-t border-t-black">
                    {!!user ?
                        (
                            <div className="pl-5 pt-3 flex gap-3">
                                <Image className="rounded-full" src={user.picture} width={50} height={50}></Image>
                                <div className="flex flex-col">
                                    <div>{user.name}</div>
                                    <Link href="/api/auth/logout">Logout</Link>
                                </div>
                            </div>
                        )
                        : (
                            <div>
                                <Link href="/api/auth/login">Login</Link>
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="w-3/4 flex items-center justify-center">{children}</div>
        </div>
    )
}