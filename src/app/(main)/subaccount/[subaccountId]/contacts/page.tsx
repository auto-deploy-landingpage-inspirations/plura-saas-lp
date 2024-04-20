import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/lib/db";
import { Contact, SubAccount, Ticket } from "@prisma/client";
import React from "react";
import format from "date-fns/format";
import CreateContactButton from "./_components/create-contact-button";
import BlurPage from "@/components/global/blur-page";

type Props = {
  params: { subaccountId: string }
}

const ContactsPage: React.FC<Props> = async ({ params }) => {
  type SubaccountWithContacts = SubAccount & {
    Contact: (Contact & { Ticket: Ticket[] })[]
  }

  const contacts = await db.subAccount.findUnique({
    where: { id: params.subaccountId },

    include: {
      Contact: {
        include: {
          Ticket: {
            select: {
              value: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc"
        },
      },
    },
  }) as SubaccountWithContacts

  const allContacts = contacts.Contact;

  const formatTotal = (tickets: Ticket[]) => {
    if (!tickets || !tickets.length) return '$0.00'
    const amt = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    });
    const laneAmt = tickets.reduce(
      (sum, ticket) => sum + (Number(ticket.value) || 0),
      0
    );
    return amt.format(laneAmt);
  }

  return (
    <BlurPage>
      <h1 className="text-4xl p-4" >Contact</h1>
      <CreateContactButton  
        subaccountId={params.subaccountId}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] border-x border-x-muted">Name</TableHead>
            <TableHead className="w-[300px] border-x border-x-muted">Email</TableHead>
            <TableHead className="w-[200px] border-x border-x-muted">Active</TableHead>
            <TableHead className="border-x border-x-muted">Created Date</TableHead>
            <TableHead className="text-right border-x border-x-muted">Total Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium truncate">
          {allContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage alt="@shadcn" />
                  <AvatarFallback className="bg-primary text-white">
                    {contact.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>
                {formatTotal(contact.Ticket) === '$0.00' ? (
                  <Badge variant={'destructive'}>Inactive</Badge>
                ) : (
                  <Badge className="bg-emerald-700">Active</Badge>
                )}
              </TableCell>
              <TableCell>{format(contact.createdAt, 'MM/dd/yyyy')}</TableCell>
              <TableCell className="text-right">
                {formatTotal(contact.Ticket)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </BlurPage>
  )
}

export default ContactsPage
