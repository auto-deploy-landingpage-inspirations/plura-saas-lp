"use client";
import React from "react";
import { Agency, AgencySidebarOption, SubAccount, User } from "@prisma/client";
import { useModal } from "@/providers/modal-provider";
import { Button } from "@/components/ui/button";
import { twMerge } from "tailwind-merge";
import CustomModal from "@/components/global/custom-modal";
import SubAccountDetails from "@/components/forms/subaccount-details";
import { PlusCircleIcon } from "lucide-react";

type Props = {
  user: User & {
    Agency:
    | (
      | Agency
      | (null & {
        SubAccount: SubAccount[]
        SidebarOption: AgencySidebarOption[]
      })
    ) | null
  }
  id: string
  className: string
}

const CreateSubaccountButton: React.FC<Props> = ({ className, id, user }) => {
  const { setOpen } = useModal();
  const agencyDetails = user.Agency;
  if (!agencyDetails) return;
  return (
    <div>
      <Button className={twMerge('w-full gap-4 flex', className)}
        onClick={() => {
          setOpen(
            <CustomModal
              title="Create a subaccount"
              subheading="You can switch between subaccounts"
            >
              <SubAccountDetails
                agencyDetails={agencyDetails}
                userId={user.id}
                userName={user.name}
              />
            </CustomModal>
          )
        }}
      >
        <PlusCircleIcon size={15} />
        Create SubAccount
      </Button>
    </div>
  )
}

export default CreateSubaccountButton
