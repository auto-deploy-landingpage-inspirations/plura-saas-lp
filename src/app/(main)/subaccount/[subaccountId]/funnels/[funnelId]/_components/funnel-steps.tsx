'use client';
import { AlertDialog } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FunnelsForSubAccount } from "@/lib/types";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { FunnelPage } from "@prisma/client";
import { Check, ExternalLink, LucideEdit } from "lucide-react";
import React, { useState } from "react";
import FunnelStepCard from "./funnel-step-card";
import { toast } from "@/components/ui/use-toast";
import { upsertFunnelPage } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/global/custom-modal";
import { useModal } from "@/providers/modal-provider";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import FunnelPagePlaceholder from "@/components/icons/funnel-page-placeholder";
import CreateFunnelPage from "@/components/forms/funnel-page";

type Props = {
  funnel: FunnelsForSubAccount;
  subaccountId: string;
  funnelId: string;
  pages: FunnelPage[];
}

const FunnelSteps: React.FC<Props> = ({ funnel, funnelId, subaccountId, pages }) => {
  const [clickedPage, setClickedPage] = useState<FunnelPage | undefined>(pages[0]);
  const [pagesState, setPagesState] = useState(pages);
  const { setOpen } = useModal();

  const detectSensor = () => {
    const isWebEntry = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    return !isWebEntry ? PointerSensor : TouchSensor;
  }
  const sensors = useSensors(
    useSensor(detectSensor(), {
      activationConstraint: {
        delay: 250,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    //no destination or same position
    if (!over) return;
    const activeIndex = pagesState.findIndex(p => p.id === active.id);
    const overIndex = pagesState.findIndex(p => p.id === over.id);
    if ( activeIndex === overIndex) return
    //change state
    const newPageOrder = [...pagesState]
      .toSpliced(activeIndex, 1)
      .toSpliced(overIndex, 0, pagesState[activeIndex])
      .map((p, idx) => {
        return { ...p, order: idx }
      })

    setPagesState(newPageOrder)
    newPageOrder.forEach(async (page, index) => {
      try {
        await upsertFunnelPage(
          subaccountId,
          {
            id: page.id,
            order: index,
            name: page.name,
          },
          funnelId
        )
      } catch (error) {
        console.log(error)
        toast({
          variant: 'destructive',
          title: 'Failed',
          description: 'Could not save page order',
        })
        return;
      }
    });

    toast({
      title: 'Success',
      description: 'Saved page order',
    });
  }

  return (
    <AlertDialog>
      <div className="flex border-[1px] lg:!flex-row flex-col">
        <aside className="flex-[0.3] bg-background p-6 flex flex-col justify-between">
          <ScrollArea className="h-full">
            <div className="flex gap-4 items-center">
              <Check />
              Funnel Steps
            </div>
            {pagesState.length ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={onDragEnd}
              >
                <SortableContext
                  id="funnels"
                  items={pages}
                  strategy={verticalListSortingStrategy}
                >
                  {pagesState.map((page) => (
                    <div
                      className="relative"
                      key={page.id}
                      onClick={() => setClickedPage(page)}
                    >
                      <FunnelStepCard
                        funnelPage={page}
                        key={page.id}
                        activePage={page.id === clickedPage?.id}
                      />
                    </div>
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              <div className="text-center text-muted-foreground py-6">No Pages</div>
            )}
          </ScrollArea>
          <Button
            className="mt-4 w-full"
            onClick={() => {
              setOpen(
                <CustomModal
                  title=" Create or Update a Funnel Page"
                  subheading="Funnel Pages allow you to create step by step processes for customers to follow"
                >
                  <CreateFunnelPage
                    subaccountId={subaccountId}
                    funnelId={funnelId}
                    order={pagesState.length}
                  />
                </CustomModal>
              )
            }}
          >
            Create New Steps
          </Button>
        </aside>
        <aside className="flex-[0.7] bg-muted p-4 ">
          {!!pages.length ? (
            <Card className="h-full flex justify-between flex-col">
              <CardHeader>
                <p className="text-sm text-muted-foreground">Page name</p>
                <CardTitle>{clickedPage?.name}</CardTitle>
                <CardDescription className="flex flex-col gap-4">
                  <div className="border-2 rounded-lg sm:w-80 w-full  overflow-clip">
                    <Link
                      href={`/subaccount/${subaccountId}/funnels/${funnelId}/editor/${clickedPage?.id}`}
                      className="relative group"
                    >
                      <div className="cursor-pointer group-hover:opacity-30 w-full">
                        <FunnelPagePlaceholder />
                      </div>
                      <LucideEdit
                        size={50}
                        className="!text-muted-foreground absolute top-1/2 left-1/2 opacity-0 transform -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 transition-all duration-100"
                      />
                    </Link>

                    <Link
                      target="_blank"
                      href={`${process.env.NEXT_PUBLIC_SCHEME}${funnel.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${clickedPage?.pathName}`}
                      className="group flex items-center justify-start p-2 gap-2 hover:text-primary transition-colors duration-200"
                    >
                      <ExternalLink size={15} />
                      <div className="w-64 overflow-hidden overflow-ellipsis ">
                        {process.env.NEXT_PUBLIC_SCHEME}
                        {funnel.subDomainName}.{process.env.NEXT_PUBLIC_DOMAIN}/
                        {clickedPage?.pathName}
                      </div>
                    </Link>
                  </div>

                  <CreateFunnelPage
                    subaccountId={subaccountId}
                    defaultData={clickedPage}
                    funnelId={funnelId}
                    order={clickedPage?.order || 0}
                  />
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="h-[600px] flex items-center justify-center text-muted-foreground">
              Create a page to view page settings.
            </div>
          )}
        </aside>
      </div>
    </AlertDialog>
  )
}

export default FunnelSteps
