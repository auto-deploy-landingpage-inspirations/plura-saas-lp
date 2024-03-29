import MediaComponent from "@/components/media";
import { getMedia } from "@/lib/queries";
import React from "react";

type Props = {
  params: { subaccountId: string; };
}

const MediaPage: React.FC<Props> = async ({ params }) => {
  const data = await getMedia(params.subaccountId);
  return (
    <>
      <MediaComponent
        data={data}
        subaccountId={params.subaccountId}
      />
    </>
  )
}

export default MediaPage
