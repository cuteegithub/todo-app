import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTasks } from "@/hooks/useTasks";
import type { User as UserType, Task } from "@shared/schema";
import { User, Mail, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function Profile() {
  const { user, isLoading: userLoading } = useAuth();
  const { tasks = [], isLoading: tasksLoading } = useTasks();

  if (userLoading || tasksLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="max-w-md mx-auto space-y-4 pt-8">
          <div className="animate-pulse">
            <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Please log in to view your profile</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedTasks = tasks.filter((task: Task) => task.status === 'completed');
  const pendingTasks = tasks.filter((task: Task) => task.status === 'open');
  const highPriorityTasks = tasks.filter((task: Task) => task.priority === 'high');

  const getInitials = (firstName: string | null, lastName: string | null) => {
    if (lastName && lastName.trim()) {
      return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    }
    return `${firstName?.[0] || ''}${firstName?.[1] || ''}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6 pt-8">
        {/* Profile Header */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-blue-100">
              <AvatarImage src={(user as UserType).profileImageUrl || undefined} alt={`${(user as UserType).firstName} ${(user as UserType).lastName}`} />
              <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-700">
                {getInitials((user as UserType).firstName, (user as UserType).lastName)}
              </AvatarFallback>
            </Avatar>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {(user as UserType).firstName}
              {(user as UserType).lastName && (user as UserType).lastName!.trim() && ` ${(user as UserType).lastName}`}
            </h1>
            <p className="text-sm text-gray-500 mb-2">Welcome back! ✨</p>
            
            <div className="flex items-center justify-center text-gray-600 mb-2">
              <Mail className="h-4 w-4 mr-2" />
              <span className="text-sm">{(user as UserType).email}</span>
            </div>
            
            <div className="flex items-center justify-center text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">
                Member since {(user as UserType).createdAt ? format(new Date((user as UserType).createdAt!), 'MMM yyyy') : 'Recently'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Task Statistics */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Task Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {completedTasks.length}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  Completed
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {pendingTasks.length}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-1 text-blue-500" />
                  Pending
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600 mb-1">
                {highPriorityTasks.length}
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 mr-1 text-orange-500" />
                High Priority Tasks
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Info */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">About Me</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="w-20 text-gray-500">Role:</span>
                <span>Computer Science Student</span>
              </div>
              <div className="flex items-center">
                <span className="w-20 text-gray-500">University:</span>
                <span>IIT Bangalore</span>
              </div>
              <div className="flex items-center">
                <span className="w-20 text-gray-500">Specialization:</span>
                <span>Software Engineering</span>
              </div>
              <div className="flex items-center">
                <span className="w-20 text-gray-500">Year:</span>
                <span>3rd Year BTech</span>
              </div>
              <div className="flex items-center">
                <span className="w-20 text-gray-500">Interests:</span>
                <span>Web Dev, AI/ML, UI/UX</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Badges */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Achievements</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="flex flex-wrap gap-2">
              {tasks.length >= 5 && (
                <Badge variant="secondary" className="bg-pink-100 text-pink-700 border-pink-200">
                  ✨ Task Creator
                </Badge>
              )}
              {completedTasks.length >= 3 && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                  🎯 Goal Achiever
                </Badge>
              )}
              {tasks.length >= 10 && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                  👑 Super Organizer
                </Badge>
              )}
              {highPriorityTasks.length >= 2 && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                  🔥 Priority Master
                </Badge>
              )}
              {completedTasks.length >= 1 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                  💪 Go-Getter
                </Badge>
              )}
              {tasks.length === 0 && (
                <Badge variant="outline" className="text-gray-500">
                  🌱 Getting Started
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <Button 
              onClick={() => window.location.href = '/api/logout'}
              variant="outline" 
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}