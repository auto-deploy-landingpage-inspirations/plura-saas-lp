'use client';
import ContactUserForm from "@/components/forms/contact-user-form";
import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import React from "react";

type Props = {
  subaccountId: string
}

const CreateContactButton: React.FC<Props> = ({ subaccountId }) => {
  const { setOpen } = useModal();
  const handleCreateContact = () => {
    setOpen(<CustomModal
      title="Create Contact"
      subheading="Enter your new client contact."
    >
      <ContactUserForm subaccountId={subaccountId} />
    </CustomModal>)
  }
  return (
    <Button onClick={() => handleCreateContact()}>
      Create Contact
    </Button>
  )
}

export default CreateContactButton
