'use client';
import LaneForm from "@/components/forms/lane-form";
import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import {
  LaneDetail,
  PipelineDetailsWithLanesCardsTagsTickets,
  TicketAndTags
} from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { Lane, Ticket } from "@prisma/client";
import { Flag, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import PipelineLane, { PipelineLaneOverlay } from "./pipeline-lane";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { getEventCoordinates } from "@dnd-kit/utilities";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

type Props = {
  lanes: LaneDetail[];
  pipelineId: string;
  subaccountId: string;
  pipelineDetails: PipelineDetailsWithLanesCardsTagsTickets;
  updateLanesOrder: (lanes: Lane[]) => Promise<void>;
  updateTicketsOrder: (tickets: Ticket[]) => Promise<void>;
}

const PipelineView: React.FC<Props> = ({
  lanes,
  pipelineDetails,
  subaccountId,
  pipelineId,
  updateLanesOrder,
  updateTicketsOrder
}) => {
  const { setOpen } = useModal();
  const router = useRouter();
  const [allLanes, setAllLanes] = useState<LaneDetail[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  useEffect(() => {
    setAllLanes(lanes);
  }, [lanes]);

  const ticketsFromAllLanes: TicketAndTags[] = [];

  lanes.forEach(item => {
    item.Tickets.forEach(i => ticketsFromAllLanes.push(i));
  });

  const [allTickets, setAllTickets] = useState(ticketsFromAllLanes);

  const handleAddLane = () => {
    setOpen(
      <CustomModal
        title="Create Lane"
        subheading="Lanes allow you to group your tickets together."
      >
        <LaneForm pipelineId={pipelineId} />
      </CustomModal>
    )
  }

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId((active?.id as number - 1).toString());
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log(active);
    console.log(over);
    // const sId = active?.id;
    // const dId = over?.id;
    // const source = allLanes.findIndex(lane => lane.id === sId);
    // const destination = allLanes.findIndex(lane => lane.id === dId);
    const source = active?.id as number - 1;
    const destination = over?.id as number - 1;
    if (source != destination) {
      const newLanes = [...allLanes]
        .toSpliced(source, 1)
        .toSpliced(destination, 0, allLanes[source])
        .map((lane, idx) => {
          return { ...lane, order: idx }
        })
      setAllLanes(newLanes)
      updateLanesOrder(newLanes)
    }

    setActiveId(null);
    // const { destination, source, type } = dropResult
    // if (
    //   !destination ||
    //   (destination.droppableId === source.droppableId &&
    //     destination.index === source.index)
    // ) {
    //   return
    // }
    //
    // switch (type) {
    //   case 'lane': {
    //     const newLanes = [...allLanes]
    //       .toSpliced(source.index, 1)
    //       .toSpliced(destination.index, 0, allLanes[source.index])
    //       .map((lane, idx) => {
    //         return { ...lane, order: idx }
    //       })
    //
    //     setAllLanes(newLanes)
    //     updateLanesOrder(newLanes)
    //   }
    //
    //   case 'ticket': {
    //     let newLanes = [...allLanes]
    //     const originLane = newLanes.find(
    //       (lane) => lane.id === source.droppableId
    //     )
    //     const destinationLane = newLanes.find(
    //       (lane) => lane.id === destination.droppableId
    //     )
    //
    //     if (!originLane || !destinationLane) {
    //       return
    //     }
    //
    //     if (source.droppableId === destination.droppableId) {
    //       const newOrderedTickets = [...originLane.Tickets]
    //         .toSpliced(source.index, 1)
    //         .toSpliced(destination.index, 0, originLane.Tickets[source.index])
    //         .map((item, idx) => {
    //           return { ...item, order: idx }
    //         })
    //       originLane.Tickets = newOrderedTickets
    //       setAllLanes(newLanes)
    //       updateTicketsOrder(newOrderedTickets)
    //       router.refresh()
    //     } else {
    //       const [currentTicket] = originLane.Tickets.splice(source.index, 1)
    //
    //       originLane.Tickets.forEach((ticket, idx) => {
    //         ticket.order = idx
    //       })
    //
    //       destinationLane.Tickets.splice(destination.index, 0, {
    //         ...currentTicket,
    //         laneId: destination.droppableId,
    //       })
    //
    //       destinationLane.Tickets.forEach((ticket, idx) => {
    //         ticket.order = idx
    //       })
    //       setAllLanes(newLanes)
    //       updateTicketsOrder([
    //         ...destinationLane.Tickets,
    //         ...originLane.Tickets,
    //       ])
    //       router.refresh()
    //     }
    //   }
    // }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      autoScroll={{ acceleration: 0, layoutShiftCompensation: false, threshold: { x: 1, y: 0.2 } }}
      modifiers={[restrictToHorizontalAxis]}
    >
      <div className="bg-white/60 dark:bg-background/60 rounded-xl p-4 use-automation-zoom-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">
            {pipelineDetails?.name}
          </h1>
          <Button
            className="flex items-center gap-4"
            onClick={handleAddLane}
          >
            <Plus size={15} />
            Create Lane
          </Button>
        </div>
        <SortableContext
          id="lanes"
          items={allLanes}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex mt-4 overflow-scroll scroll-bar gap-4 relative">
            {allLanes.map((lane, index) => (
              <PipelineLane
                allTickets={allTickets}
                setAllTickets={setAllTickets}
                subaccountId={subaccountId}
                pipelineId={pipelineId}
                tickets={lane.Tickets}
                laneDetails={lane}
                index={index}
                key={lane.id}
              />
            ))}
            <DragOverlay
            >
              {activeId && (
                <PipelineLaneOverlay
                  name={allLanes[parseInt(activeId)].name}
                />
              )}
            </DragOverlay>
          </div>
        </SortableContext>
        {allLanes.length === 0 && (
          <div className="flex items-center justify-center w-full flex-col">
            <div className="opacity-100">
              <Flag
                width="100%"
                height="100%"
                className="text-muted-foreground"
              />
            </div>
          </div>
        )}
      </div>
    </DndContext>
  )
}

export default PipelineView
