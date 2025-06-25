"use client"

import Link from "next/link";
import { useParams } from "next/navigation";

const HistoryLink = ({ name, cid }: { name: string, cid: string }) => {
  const params = useParams();
  const slug = params.id;
  return (
    <Link href={`/${cid}`} className={`py-2 px-2.5 mx-1.5 cursor-pointer rounded-[10px] flex items-center gap-1.5 text-sm ${slug == cid ? "bg-[#ffffff0d]": "hover:bg-[#3b3b3a]"}`}>
      {name}
    </Link>
  )
}

export default HistoryLink