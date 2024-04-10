import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/db";
import { getLanesWithTicketAndTags, getPipelineDetails, updateLanesOrder, updateTicketsOrder } from "@/lib/queries";
import { LaneDetail } from "@/lib/types";
import { redirect } from "next/navigation";
import React from "react";
import PipelineInfobar from "../_components/pipeline-infobar";
import PipelineSettings from "../_components/pipeline-settings";
import PipelineView from "../_components/pipeline-view";

type Props = {
  params: { subaccountId: string, pipelineId: string },
}

const PipelinePage: React.FC<Props> = async ({ params }) => {
  const pipelineDetails = await getPipelineDetails(params.pipelineId);

  if (!pipelineDetails) {
    return redirect(`/subaccount/${params.subaccountId}/pipelines`);
  }

  const pipelines = await db.pipeline.findMany({
    where: { subAccountId: params.subaccountId },
  });

  const lanes = (await getLanesWithTicketAndTags(
    params.pipelineId,
  )) as LaneDetail[];

  return (
    <Tabs
      defaultValue="view"
      className="w-full"
    >
      <TabsList className="bg-transparent border border-b-2 h-16 w-full justify-between mb-4">
        <PipelineInfobar
          pipelineId={params.pipelineId}
          subaccountId={params.subaccountId}
          pipelines={pipelines}
        />
        <div>
          <TabsTrigger
            value="view"
            className="!bg-transparent w-40"
          >Pipeline View</TabsTrigger>
          <TabsTrigger
            value="settings"
            className="!bg-transparent w-40"
          >Settings</TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value="view">
        <PipelineView
          lanes={lanes.map((lane) => ({ ...lane, color: `#${Math.random().toString(16).slice(2, 8)}` }))}
          pipelineId={params.pipelineId}
          subaccountId={params.subaccountId}
          pipelineDetails={pipelineDetails}
          updateLanesOrder={updateLanesOrder}
          updateTicketsOrder={updateTicketsOrder}
        />
      </TabsContent>
      <TabsContent value="settings">
        <PipelineSettings
          pipelines={pipelines}
          pipelineId={params.pipelineId}
          subaccountId={params.subaccountId}
        />
      </TabsContent>
    </Tabs>
  )
}

export default PipelinePage
