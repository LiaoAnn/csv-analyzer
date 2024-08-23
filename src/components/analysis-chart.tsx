import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";

type AnalysisChartProps = {
  filteredAndGroupedData: Record<string, any[]>;
};

export function AnalysisChart({ filteredAndGroupedData }: AnalysisChartProps) {
  const chartData = useMemo(() => {
    return Object.entries(filteredAndGroupedData).map(([key, rows]) => {
      return {
        property: key,
        userCount: rows.length,
      };
    });
  }, [filteredAndGroupedData]);

  const chartConfig = useMemo(() => {
    return {
      userCount: {
        label: "User Count",
        color: "hsl(var(--chart-1))",
      },
    };
  }, [filteredAndGroupedData]);

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="property" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {Object.keys(chartConfig).map((key) => (
          <Bar key={key} dataKey={key} radius={[4, 4, 0, 0]} />
        ))}
      </BarChart>
    </ChartContainer>
  );
}
