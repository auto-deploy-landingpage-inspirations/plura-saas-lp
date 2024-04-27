'use client'
import SubscriptionFormWrapper from "@/components/forms/subscription-form/subscription-form-wrapper";
import CustomModal from "@/components/global/custom-modal";
import { PriceList } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

type Props = {
  prices: PriceList['data'];
  customerId: string;
  planExist: boolean;
}

const SubscriptionHelper: React.FC<Props> = ({ prices, customerId, planExist }) => {
  const { setOpen } = useModal();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');

  useEffect(() => {
    if (plan) {
      setOpen(
        <CustomModal
          title="Upgrade Plan!"
          subheading="Get started today to get access to the premium features"
        >
          <SubscriptionFormWrapper
            planExists={planExist}
            customerId={customerId}
          />
        </CustomModal>,
        async () => ({
            plans: {
                defaultPriceId: plan ? plan : "",
                plans: prices,
              }
          })
      )
    }
  }, [plan])

  return (
    <>
    </>
  )
}

export default SubscriptionHelper;
