'use client';
import React, { useEffect, useState } from "react";
import { getMedia } from "@/lib/queries";
import { GetMediaFiles } from "@/lib/types";
import MediaComponent from "@/components/media";

type Props = {
  subaccountId: string;
}

const MediaBucketTab: React.FC<Props> = ({ subaccountId }) => {
  const [data, setData] = useState<GetMediaFiles>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMedia(subaccountId);
      setData(response);
    }
    fetchData();
  }, [subaccountId]);

  return (
    <div className="h-[900px] overflow-scroll invisible-scrollbar p-4">
      <MediaComponent
        data={data}
        subaccountId={subaccountId}
      />
    </div>
  )
}

export default MediaBucketTab
