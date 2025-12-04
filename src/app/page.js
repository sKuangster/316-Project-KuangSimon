import Image from "next/image";
import Link from "next/link";
import AppBanner from "../components/AppBanner";

export default function WelcomeScreen() {

  return (
    <div className="h-screen flex flex-col bg-white">

      <AppBanner />

      <div className="flex-1 flex flex-col justify-center items-center gap-6">

        <div className="text-7xl text-black">The Playlister</div>

        <div className="relative w-[250px] h-[250px]">
          <Image
            src="/music_notes.png"
            alt="music notes"
            fill
            className="object-contain"
          />
        </div>

        <div className="flex justify-center gap-4">
          <button className="text-black">Continue As Guest</button>
          <Link className="text-black" href="/signin">Login</Link>
          <Link className="text-black" href="/create_account">Create Account</Link>
        </div>

      </div>

    </div>
  );
}
