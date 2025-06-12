import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function SkillsManagerSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-8 w-24" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input fields skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 flex-grow" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </div>

        {/* Add button skeleton */}
        <Skeleton className="h-10 w-24" />

        {/* Skills grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <Skeleton
              key={index}
              className="h-10 w-full rounded-full"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 