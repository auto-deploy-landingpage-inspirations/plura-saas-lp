"use client";
import { deleteSubaccount, getSubaccountDetails, saveActivityLogsNotification } from "@/lib/queries";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  subaccountId: string,
}

const DeleteButton: React.FC<Props> = ({ subaccountId }) => {
  const router = useRouter();
  return (
    <div onClick={async () => {
      const response = await getSubaccountDetails(subaccountId);
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Deleted a subaccount | ${response?.name}`,
        subaccountId: subaccountId
      });
      await deleteSubaccount(subaccountId);
      router.refresh();
    }}>
      Delete Sub Account
    </div>
  )
}

export default DeleteButton
