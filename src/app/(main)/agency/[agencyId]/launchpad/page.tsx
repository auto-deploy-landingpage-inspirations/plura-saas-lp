import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  params: {
    agencyId: string,
  },
}

const Launchpad: React.FC<Props> = async ({ params }) => {
  const agencyDetails = await db.agency.findUnique({
    where: { id: params.agencyId },
  });

  if (!agencyDetails) return;

  const allDetailsExist = agencyDetails.address &&
    agencyDetails.id &&
    agencyDetails.agencyLogo &&
    agencyDetails.city &&
    agencyDetails.companyEmail &&
    agencyDetails.companyPhone &&
    agencyDetails.country &&
    agencyDetails.name &&
    agencyDetails.state &&
    agencyDetails.zipCode;

  if (!allDetailsExist) return;

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="w-full h-full max-w-[800px]">
          <Card className="border-none">
            <CardHeader>
              <CardTitle>
                Lets get Started
              </CardTitle>
              <CardDescription>
                Follow the steps below to get your account setup.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
                <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                  <Image
                    src={'/appstore.png'}
                    alt="app logo"
                    width={80}
                    height={80}
                    className="rounded-md object-contain"
                  />
                  <p>Save the website as a shortcut on your mobile device.</p>
                </div>
                <Button>Save</Button>
              </div>
              <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
                <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                  <Image
                    src={'/stripelogo.png'}
                    alt="app logo"
                    width={80}
                    height={80}
                    className="rounded-md object-contain"
                  />
                  <p>Connect your stripe account to accept payment and see your dashboard</p>
                </div>
                <Button>Connect</Button>
              </div>
              <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
                <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                  <Image
                    src={agencyDetails.agencyLogo}
                    alt="agency logo"
                    width={80}
                    height={80}
                    className="rounded-md object-contain"
                  />
                  <p>Fill in all your business details.</p>
                </div>
                {allDetailsExist ? (
                  <CheckCircleIcon
                    size={50}
                    className="text-primary p-2 flex-shrink-0"
                  />
                ) : (
                  <Link className="text-primary p-2 px-4 rounded-md text-white" href={`/agency/${params.agencyId}/settings`}> Save</Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Launchpad
