import { ModeToggle } from "@/components/global/mode-toggle"
import { UserButton } from "@clerk/nextjs"
import { type User } from "@clerk/nextjs/server"
import Image from "next/image"
import Link from "next/link"

type Props = {
  user?: null | User
}
export default function Navigation({ user }: Props) {
  return (
    <div className="fixed top-0 right-0 left-0 z-[20] px-4 py-1 2xl:py-2 flex items-center justify-between bg-white dark:bg-black">
      <aside className="flex items-center gap-2">
        <Image src={'/assets/plura-logo.svg'} alt="Plura Logo" width={40} height={40} />
        <span className="text-xl font-bold">
          Plura.
        </span>
      </aside>
      <nav className="hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]">
        <ul className="flex items-center justify-center gap-8">
          <Link href={'#'}>Pricing</Link>
          <Link href={'#'}>About</Link>
          <Link href={'#'}>Documentation</Link>
          <Link href={'#'}>Features</Link>
        </ul>
      </nav>
      <aside className="p-4 flex items-center gap-2">
        <Link href={'/agency'} className="bg-primary text-white p-2 px-4 rounded-md hover:bg-primary/80 transition-colors delay-75">
          Login
        </Link>
        <UserButton />
        <ModeToggle />
      </aside>
    </div>
  )
}
