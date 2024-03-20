'use client';

import { Agency } from "@prisma/client";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  data?: Partial<Agency>
}

export default function AgencyDetails({ data }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [deletingAgency, setDeletingAgency] = useState(false);

  return (
    <div>
    AgencyDetails
    </div>
  )
}
