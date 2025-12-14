import type { ForecastData } from "@/Api/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { format } from "date-fns"

interface HourlyTempProps {
  data: ForecastData
}

const HourlyTemp = ({ data }: HourlyTempProps) => {
    
if (!data?.list  || data.list.length === 0) {
    return (
      <Card className="flex-1 shadow-xl">
        <CardHeader>
          <CardTitle>Today’s Temperature</CardTitle>
        </CardHeader>
        <CardContent className="h-56 flex items-center justify-center text-muted-foreground">
          Loading temperature data...
        </CardContent>
      </Card>
    )
  }

  const chartData = data.list.slice(0, 8).map((item) => ({
    time: format(new Date(item.dt * 1000), "ha"),
    temp: Math.round(item.main.temp),
    feels_like: Math.round(item.main.feels_like),
  })) ?? [];

  return (
    <Card className="flex-1 shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          Today’s Temperature
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="#94a3b8"
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="#94a3b8"
                tickFormatter={(v) => `${v}°`}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-md">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs uppercase text-muted-foreground">
                              Temperature
                            </p>
                            <p className="text-lg font-bold">
                              {payload[0].value}°
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase text-muted-foreground">
                              Feels Like
                            </p>
                            <p className="text-lg font-bold">
                              {payload[1].value}°
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />

              <Line
                type="monotone"
                dataKey="temp"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="feels_like"
                stroke="#64748b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default HourlyTemp