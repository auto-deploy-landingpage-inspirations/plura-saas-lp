'use client';
import { AreaChart } from "@tremor/react";
import React from "react";

type Props = {
  data: Array<any>
}

const AreaChartCustom: React.FC<Props> = ({ data }) => {
    return (
        <>
            <AreaChart
              className="text-sm stroke-primary"
              data={data}
              index="created"
              categories={["amount_total"]}
              colors={['primary']}
              yAxisWidth={30}
              showAnimation={true}
            />
        </>
    )
}

export default AreaChartCustom
