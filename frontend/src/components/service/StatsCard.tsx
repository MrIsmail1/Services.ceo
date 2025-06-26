import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  color = "text-gray-400",
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div
          className={`text-2xl font-bold ${color
            .replace("text-", "text-")
            .replace("-400", "-600")}`}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
