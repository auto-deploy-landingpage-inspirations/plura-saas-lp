import { db } from '@/lib/db';
import React from 'react';
import DataTable from './data-table';
import { PlusIcon } from 'lucide-react';
import { currentUser } from '@clerk/nextjs';
import { columns } from './columns';
import SendInvitation from '@/components/forms/send-invitation';

type Props = {
  params: {
    agencyId: string
  }
}

const TeamPage = async ({ params }: Props) => {
  const authUser = await currentUser();

  const teamMembers = await db.user.findMany({
    where: {
      Agency: { id: params.agencyId }
    },
    include: {
      Agency: {
        include: { SubAccount: true },
      },
      Permissions: {
        include: { SubAccount: true },
      },
    }
  });

  if (!authUser) return null;

  const agencyDetails = await db.agency.findUnique({
    where: { id: params.agencyId },
    include: { SubAccount: true },
  });

  if (!agencyDetails) return null;

  return (
    <DataTable
      actionButtonText={
        <>
          <PlusIcon size={15} />
          Add
        </>
      }
      modalChildren={ <SendInvitation agencyId={agencyDetails.id} /> }
      filterValue='name'
      columns={columns}
      data={teamMembers}
    />
  )
}

export default TeamPage;
