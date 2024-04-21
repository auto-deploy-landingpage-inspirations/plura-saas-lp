'use client';
import { useModal } from "@/providers/modal-provider";
import React from "react";
import { Button } from "../ui/button";
import CustomModal from "../global/custom-modal";
import UploadMediaForm from "../forms/upload-media";

type Props = {
  subaccountId: string;
}

const MediaUploadButton: React.FC<Props> = ({ subaccountId }) => {
  const { setOpen } = useModal();
    return (
      <Button
        onClick={() => setOpen(<CustomModal title="Upload Media" subheading="Upload a file in your media bucket">
          <UploadMediaForm subaccountId={subaccountId} />
        </CustomModal>)}
      >
        Upload
      </Button>
    )
}

export default MediaUploadButton
