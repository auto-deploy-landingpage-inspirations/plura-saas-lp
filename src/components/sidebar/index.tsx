import { getAuthUserDetails } from "@/lib/queries"
import MenuOptions from "./menu-options";

type Props = {
  id: string,
  type: 'agency' | 'subaccount'
}
export default async function Sidebar({ id, type }: Props) {
  const user = await getAuthUserDetails();

  if (!user) return;
  if (!user.Agency) return;

  const details = type === 'agency'
    ? user.Agency
    : user.Agency.SubAccount.find(sa => sa.id === id);


  const isWhiteLabeledAgency = user.Agency.whiteLabel;

  if (!details) return;

  let sidebarLogo = user.Agency.agencyLogo || '/assets/plura-logo.svg';

  if (!isWhiteLabeledAgency) {
    if (type === 'subaccount') {
      sidebarLogo = user.Agency.SubAccount.find(sa => sa.id === id)?.subAccountLogo || user.Agency.agencyLogo;
    }
  }

  const sidebarOptions = type === 'agency'
    ? user.Agency.SidebarOption || []
    : user.Agency.SubAccount.find(sa => sa.id === id)?.SidebarOption || [];

  const subAccounts = user.Agency.SubAccount.filter((subaccount) =>
    user.Permissions.find((permission) =>
      permission.access && permission.subAccountId === subaccount.id)
  )

  return (
    <>
      <MenuOptions 
        defaultOpen={true}
        details={details}
        id={id}
        sideBarLogo={sidebarLogo}
        sidebarOpt={sidebarOptions}
        subAccounts={subAccounts}
        user={user}
      />
      <MenuOptions 
        details={details}
        id={id}
        sideBarLogo={sidebarLogo}
        sidebarOpt={sidebarOptions}
        subAccounts={subAccounts}
        user={user}
      />
    </>  
  )
}
