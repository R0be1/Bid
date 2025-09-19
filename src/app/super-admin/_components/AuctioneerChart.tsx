// components/AuctioneerChart.tsx
"use client";

import { PieChart, Pie, Cell } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface AuctioneerChartProps {
  data: { name: string; count: number; fill: string }[];
  chartConfig: any;
}

export default function AuctioneerChart({
  data,
  chartConfig,
}: AuctioneerChartProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[200px] w-full max-w-[300px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Pie
          data={data}
          dataKey="count"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <ChartLegend
          content={<ChartLegendContent />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
}
