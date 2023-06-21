"use client";

import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ScriptableContext,
} from "chart.js";
import "chartjs-adapter-date-fns";

import { enUS } from "date-fns/locale";
import { Line } from "react-chartjs-2";

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface Props {
  labels: any[];
  data: string[];
}

const Chart: React.FC<Props> = ({ labels, data }) => {
  return (
    <Line
      plugins={[
        {
          id: "line",
          afterDraw: (chart: { tooltip?: any; scales?: any; ctx?: any }) => {
            if (chart.tooltip._active && chart.tooltip._active.length) {

              const activePoint = chart.tooltip._active[0];
              const { ctx } = chart;
              const { x } = activePoint.element;
              const topY = chart.scales.y.top;
              const bottomY = chart.scales.y.bottom;

              ctx.save();
              ctx.beginPath();
              ctx.moveTo(x, topY);
              ctx.lineTo(x, bottomY);
              ctx.lineWidth = 2;
              ctx.strokeStyle = "#FFFFFF";
              ctx.stroke();
              ctx.restore();
            }
          },
        },
      ]}
      options={{
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "#181840",
            bodyColor: "#FFF",
            padding: 10,
          },
        },
        responsive: true,
        scales: {
          x: {
            type: "time",
            time: {
              unit: "day",
            },
            adapters: {
              date: {
                locale: enUS,
              },
            },
          },
          y: {
            position: "right"
          }
        },
      }}
      data={{
        labels,
        datasets: [
          {
            label: "Price",
            borderColor: "#2AC8EB",
            backgroundColor: (context: ScriptableContext<"line">) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);

              gradient.addColorStop(0, "rgba(42,200,235, 1)");
              gradient.addColorStop(0.15, "rgba(42,200,235, 0.2)");
              gradient.addColorStop(1, "rgba(42,200,235, 0)");

              return gradient;
            },
            fill: "start",
            data: data,
          },
        ],
      }}
    />
  );
};

export { Chart };
