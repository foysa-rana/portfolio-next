import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

const AboutMeSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="space-y-2 flex-1">
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
        <div className="space-y-2">
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
        <div className="space-y-2">
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </CardFooter>
    </Card>
  )
}

export default AboutMeSkeleton 