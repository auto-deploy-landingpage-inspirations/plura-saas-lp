import { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar";
import BlurPage from "@/components/global/blur-page";
import Unauthorized from "@/components/unauthorized";
import { getNotificationAndUser, verifyAndAcceptInvitation } from "@/lib/queries";
import Infobar from "@/components/global/infobar";

type Props = {
  children: ReactNode,
  params: {
    agencyId: string
  }
}

export default async function AgencyLayout({ children, params }: Props) {
  const agencyId = await verifyAndAcceptInvitation();
  const user = await currentUser();

  if (!user) return redirect('/');

  if (!agencyId) return redirect('/agency');

  if (user.privateMetadata.role !== "AGENCY_OWNER" && user.privateMetadata.role !== "AGENCY_ADMIN") {
    return <Unauthorized />
  }

  let allNoti: any = [];

  const notifications = await getNotificationAndUser(agencyId);
  if (notifications) allNoti = notifications;

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={params.agencyId} type="agency" />
      <div className="md:pl-[300px]">
        <Infobar
          notifications={allNoti}
          role={user.privateMetadata.role}
        />
        <div className="relative">
          <BlurPage>
            {children}
          </BlurPage>
        </div>
      </div>
    </div>
  )
}
