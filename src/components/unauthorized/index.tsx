import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="p-4 text-center h-screen w-screen flex items-center justify-center flex-col">
      <h1 className="text-3xl md:text-6xl">Unauthorized Access</h1>
      <p>Please contact support or your Agency owner to get access</p>
      <Link
        href={'/'}
        className="mt-4 p-2 bg-primary"
      >
        Back to Home
      </Link>
    </div>
  )
}
