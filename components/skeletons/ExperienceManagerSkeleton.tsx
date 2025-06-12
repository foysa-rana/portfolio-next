import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ExperienceManagerSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Experience Button Skeleton */}
        <div className="w-full p-4 border rounded-lg">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        {/* Experience Cards Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                {/* Title */}
                <Skeleton className="h-6 w-48 mb-2" />
                
                {/* Company */}
                <Skeleton className="h-4 w-40 mb-2" />
                
                {/* Date Range */}
                <Skeleton className="h-4 w-56 mb-2" />
                
                {/* Location */}
                <Skeleton className="h-4 w-32 mb-4" />
                
                {/* Responsibilities */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[85%]" />
                </div>

                {/* Remove Button */}
                <div className="mt-4">
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 