import Image from "next/image";
import Link from "next/link";

export default function AppBanner() {
    return (
        <div className="w-full bg-fuchsia-500 py-2 px-4 flex items-center justify-between">
            <Link href="" className="text-3xl w-10 h-10 bg-white rounded-full flex items-center justify-center shadow">
                🏠︎
            </Link>

            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow">
                <Image
                    src="/profile_icon.png"
                    alt="Profile"
                    width={24}
                    height={24}
                />
            </div>

        </div>
    );
}
