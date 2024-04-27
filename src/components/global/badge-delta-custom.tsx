'use client'
import { BadgeDelta } from "@tremor/react";
import React from "react";

type Props = {}

const BadgeDeltaCustom: React.FC<Props> = () => {
  return (
    <>
      <BadgeDelta
        className="rounded-xl bg-transparent"
        deltaType={"moderateIncrease"}
        isIncreasePositive={true}
        size={'xs'}
      >
        +12.3%
      </BadgeDelta>
    </>
  )
}

export default BadgeDeltaCustom
