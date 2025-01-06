import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar } from 'lucide-react'

interface StatProps {
  title: string
  value: number
  icon: React.ReactNode
}

const Stat: React.FC<StatProps> = ({ title, value, icon }) => (
  <div className="flex items-center space-x-2">
    <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <h3 className="text-2xl font-bold">{value.toLocaleString()}</h3>
    </div>
  </div>
)

export function Graphs() {
  // In a real application, you would fetch this data from an API or database
  const userCount = 1234
  const eventCount = 12

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Event Statistics</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* <Stat title="Total Users" value={userCount} icon={<Users className="h-4 w-4 text-primary" />} /> */}
        <Stat title="Total Events" value={eventCount} icon={<Calendar className="h-4 w-4 text-primary" />} />
      </CardContent>
    </Card>
  )
}

