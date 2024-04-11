import TicketForm from "@/components/forms/ticket-form";
import CustomModal from "@/components/global/custom-modal";
import TagComponent from "@/components/global/tag";
import LinkIcon from "@/components/icons/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { toast } from "@/components/ui/use-toast";
import { deleteTicket, saveActivityLogsNotification } from "@/lib/queries";
import { TicketWithTags } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { useSortable } from "@dnd-kit/sortable";
import { Contact2, Edit, MoreHorizontalIcon, Trash, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  setAllTickets: Dispatch<SetStateAction<TicketWithTags>>;
  ticket: TicketWithTags[0];
  index: number;
  subaccountId: string;
  allTickets: TicketWithTags;
}

const PipelineTicket: React.FC<Props> = ({
  setAllTickets,
  ticket,
  index,
  subaccountId,
  allTickets
}) => {

  const router = useRouter()
  const { setOpen, data } = useModal()

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: ticket.id.toString(),
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition
  } : undefined;


  const editNewTicket = (ticket: TicketWithTags[0]) => {
    setAllTickets((tickets) =>
      allTickets.map((t) => {
        if (t.id === ticket.id) {
          return ticket
        }
        return t
      })
    )
  }

  const handleClickEdit = async () => {
    setOpen(
      <CustomModal
        title="Update Ticket Details"
        subheading=""
      >
        <TicketForm
          getNewTicket={editNewTicket}
          laneId={ticket.laneId}
          subaccountId={subaccountId}
        />
      </CustomModal>,
      async () => {
        return { ticket: ticket }
      }
    )
  }

  const handleDeleteTicket = async () => {
    try {
      setAllTickets((tickets) => tickets.filter((t) => t.id !== ticket.id))
      const response = await deleteTicket(ticket.id);
      toast({
        title: 'Deleted',
        description: 'Deleted ticket from lane.',
      })

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Deleted a ticket | ${response?.name}`,
        subaccountId: subaccountId,
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oppse!',
        description: 'Could not delete the ticket.',
      })
      console.log(error)
    }
  }

  return (
    <div
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
    >
      <AlertDialog>
        <DropdownMenu>
          <Card className="my-4 dark:bg-slate-900 bg-white shadow-none transition-all">
            <CardHeader className="p-[12px]">
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg w-full">{ticket.name}</span>
                <DropdownMenuTrigger>
                  <MoreHorizontalIcon
                    className="text-muted-foreground"
                  />
                </DropdownMenuTrigger>
              </CardTitle>
              <span className="text-muted-foreground text-xs">
                {new Date().toLocaleDateString()}
              </span>
              <div className="flex items-center flex-wrap gap-2">
                {ticket.Tags.map((tag) => (
                  <TagComponent
                    key={tag.id}
                    title={tag.name}
                    colorName={tag.color}
                  />
                ))}
              </div>
              <CardDescription className="w-full">
                {ticket.description}
              </CardDescription>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="p-2 text-muted-foreground flex gap-2 hover:bg-muted transition-all rounded-lg cursor-pointer items-center">
                    <LinkIcon />
                    <span className="text-xs font-bold">CONTACT</span>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent side="right" className="w-fit">
                  <div className="flex justify-between space-x-4">
                    <Avatar>
                      <AvatarImage />
                      <AvatarFallback className="bg-primary">
                        {ticket.Customer?.name[0].slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold">
                        {ticket.Customer?.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {ticket.Customer?.email}
                      </p>
                      <div className="flex items-center pt-2">
                        <Contact2 className="mr-2 h-4 w-4 opacity-70" />
                        <span className="text-muted-foreground text-xs">
                          Joined {" "}
                          {ticket.Customer?.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </CardHeader>
            <CardFooter className="m-0 p-2 border-t-[1px] border-muted-foreground/20 felx-items-center justify-between">
              <div className="flex item-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    alt="contact"
                    src={ticket.Assigned?.avatarUrl}
                  />
                  <AvatarFallback className="bg-primary text-sm text-white">
                    {ticket.Assigned?.name}
                    {!ticket.assignedUserId && <User2 size={14} />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center">
                  <span className="text-sm text-muted-foreground">
                    {ticket.assignedUserId
                      ? 'Assigned to'
                      : 'Not Assigned'}
                  </span>
                  {ticket.assignedUserId && (
                    <span className="text-xs w-28  overflow-ellipsis overflow-hidden whitespace-nowrap text-muted-foreground">
                      {ticket.Assigned?.name}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-sm font-bold">
                {!!ticket.value &&
                  new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: 'USD',
                  }).format(+ticket.value)}
              </span>
            </CardFooter>
            <DropdownMenuContent>
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <AlertDialogTrigger>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Trash size={15} />
                  Delete Ticket
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={handleClickEdit}
              >
                <Edit size={15} />
                Edit Ticket
              </DropdownMenuItem>
            </DropdownMenuContent>
          </Card>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete
                the ticket and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive"
                onClick={handleDeleteTicket}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </DropdownMenu>
      </AlertDialog>
    </div>
  )
}

export default PipelineTicket

export function TicketOverlay({ ticket }: { ticket: TicketWithTags[0] }) {
  return (
    <Card className="my-4 md:-ml-[300px] max-w-[280px] dark:bg-slate-900 bg-white shadow-none transition-all">
      <CardHeader className="p-[12px]">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg w-full">{ticket.name}</span>
          <div>
            <MoreHorizontalIcon
              className="text-muted-foreground"
            />
          </div>
        </CardTitle>
        <span className="text-muted-foreground text-xs">
          {new Date().toLocaleDateString()}
        </span>
        <div className="flex items-center flex-wrap gap-2">
          {ticket.Tags.map((tag) => (
            <TagComponent
              key={tag.id}
              title={tag.name}
              colorName={tag.color}
            />
          ))}
        </div>
        <CardDescription className="w-full">
          {ticket.description}
        </CardDescription>
        <div>
          <div>
            <div className="p-2 text-muted-foreground flex gap-2 hover:bg-muted transition-all rounded-lg cursor-pointer items-center">
              <LinkIcon />
              <span className="text-xs font-bold">CONTACT</span>
            </div>
          </div>
          <div className="w-fit">
            <div className="flex justify-between space-x-4">
              <Avatar>
                <AvatarImage />
                <AvatarFallback className="bg-primary">
                  {ticket.Customer?.name[0].slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold">
                  {ticket.Customer?.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {ticket.Customer?.email}
                </p>
                <div className="flex items-center pt-2">
                  <Contact2 className="mr-2 h-4 w-4 opacity-70" />
                  <span className="text-muted-foreground text-xs">
                    Joined {" "}
                    {ticket.Customer?.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="m-0 p-2 border-t-[1px] border-muted-foreground/20 felx-items-center justify-between">
        <div className="flex item-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage
              alt="contact"
              src={ticket.Assigned?.avatarUrl}
            />
            <AvatarFallback className="bg-primary text-sm text-white">
              {ticket.Assigned?.name}
              {!ticket.assignedUserId && <User2 size={14} />}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center">
            <span className="text-sm text-muted-foreground">
              {ticket.assignedUserId
                ? 'Assigned to'
                : 'Not Assigned'}
            </span>
            {ticket.assignedUserId && (
              <span className="text-xs w-28  overflow-ellipsis overflow-hidden whitespace-nowrap text-muted-foreground">
                {ticket.Assigned?.name}
              </span>
            )}
          </div>
        </div>
        <span className="text-sm font-bold">
          {!!ticket.value &&
            new Intl.NumberFormat(undefined, {
              style: 'currency',
              currency: 'USD',
            }).format(+ticket.value)}
        </span>
      </CardFooter>
    </Card>
  )
}
