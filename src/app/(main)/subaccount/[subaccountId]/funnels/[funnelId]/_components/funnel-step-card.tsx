'use client';
import Mail from "@/components/icons/mail";
import { Card, CardContent } from "@/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FunnelPage } from "@prisma/client";
import { ArrowDown } from "lucide-react";
import React from "react";

type Props = {
  funnelPage: FunnelPage;
  activePage: boolean;
}

const FunnelStepCard: React.FC<Props> = ({ funnelPage, activePage }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: funnelPage.id
  });
  const style = transform ? {
    transform: CSS.Transform.toString(transform),
    transition,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Card
        className="p-0 relative cursor-grab my-2"
      >
        <CardContent className="p-0 flex items-center gap-4 flex-row">
          <div className="h-14 w-14 bg-muted flex items-center justify-center">
            <Mail />
            <ArrowDown
              size={18}
              className="absolute -bottom-2 text-primary"
            />
          </div>
          {funnelPage.name}
        </CardContent>
        {activePage && (
          <div className="w-2 top-2 right-2 h-2 absolute bg-emerald-500 rounded-full" />
        )}
      </Card>
    </div>
  )
}

export default FunnelStepCard
