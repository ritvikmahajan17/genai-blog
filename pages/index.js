import Image from "next/image"
import HeroImage from "../public/hero.webp"
import Logo from "../components/Logo/Logo"
import { useRouter } from "next/router";

export default function Home() {

  const router = useRouter();

  const handleBeginClick = () => {
    router.push("/posts/new")
  }


  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Image src={HeroImage} alt="hero" fill className="absolute" />
      <div className="h-100 max-w-screen-sm text-white flex gap-2 flex-col justify-center items-center bg-slate-900/90 rounded-md backdrop-blur-sm p-5 relative z-10">
        <Logo />
        <div>AI Powered SAAS solution to generate blogs</div>     
          <button onClick={handleBeginClick} className="h-10 inline bg-green-500 w-72 rounded">Begin</button>
      </div>
    </div>
  )
}
