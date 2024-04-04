'use client';
import { getSubaccountTeamMembers, saveActivityLogsNotification, searchContacts, upsertTicket } from "@/lib/queries";
import { TicketFormSchema, TicketWithTags } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact, Tag, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../ui/use-toast";

type Props = {
  laneId: string;
  subaccountId: string;
  getNewTicket: (ticket: TicketWithTags[0]) => void;
}

const TicketForm: React.FC<Props> = ({ getNewTicket, laneId, subaccountId }) => {
  const { data: defaultData, setClose } = useModal();
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [contact, setContact] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [allTeamMembers, setAllTeamMembers] = useState<User[]>([]);
  const [assignedTo, setAssignedTo] = useState(
    defaultData?.ticket?.Assigned?.id || ''
  );
  const saveTimeRef = useRef<ReturnType<typeof setTimeout>>();
  const form = useForm<z.infer<typeof TicketFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(TicketFormSchema),
    defaultValues: {
      name: defaultData.ticket?.name || '',
      description: defaultData.ticket?.description || '',
      value: String(defaultData.ticket?.value) || '',
    }
  });
  const isLoading = form.formState.isLoading;

  const onSubmit = async (values: z.infer<typeof TicketFormSchema>) => {
    if (!laneId) return;

    try {
      const response = await upsertTicket({
        ...values,
        laneId,
        id: defaultData.ticket?.id,
        assignedUserId: assignedTo,
        ...(contact ? { customerId: contact } : {}),
      }, tags);

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a Ticket | ${response.name}`,
        subaccountId: subaccountId,
      });

      toast({
        title: 'Success',
        description: 'Ticket saved successfully'
      });
      if (response) getNewTicket(response);
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oopsse!',
        description: 'Something went wrong.'
      });
    }
  }

  useEffect(() => {
    if (subaccountId) {
      const fetchData = async () => {
        const response = await getSubaccountTeamMembers(subaccountId);
        console.log(response);
        if (response) setAllTeamMembers(response);
      }
      fetchData();
    }
  }, [subaccountId]);

  useEffect(() => {
    if (defaultData.ticket) {
      form.reset({
        name: defaultData.ticket?.name || '',
        description: defaultData.ticket?.description || '',
        value: String(defaultData.ticket?.value) || '',
      });
      if (defaultData.ticket.customerId) {
        setContact(defaultData.ticket.customerId);
      }

      const fetchData = async () => {
        const response = await searchContacts(
          defaultData.ticket?.Customer?.name || ''
        );
        setContactList(response);
      }

      fetchData();
    }
  }, []);

  return (
    <>
      TicketForm
    </>
  )
}

export default TicketForm
