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

        {/* Background Profile */}
        <Card className="border-0 shadow-lg overflow-hidden">
          {/* Background Image */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=200&q=80"
              alt="University campus background"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80"></div>
            <div className="absolute bottom-4 left-6 text-white">
              <h3 className="text-lg font-semibold">Professional Background</h3>
              <p className="text-sm opacity-90">Computer Science @ IIT Bangalore</p>
            </div>
          </div>
          
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900">Background</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Education</h4>
                  <p>Currently pursuing BTech in Computer Science at Indian Institute of Technology, Bangalore. Maintaining excellent academic performance with focus on software engineering principles and modern development practices.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                  <p>Active in coding competitions and hackathons. Completed internships in web development and contributed to open-source projects. Strong foundation in full-stack development with React, Node.js, and Python.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">JavaScript</Badge>
                    <Badge variant="outline" className="text-xs">React</Badge>
                    <Badge variant="outline" className="text-xs">Python</Badge>
                    <Badge variant="outline" className="text-xs">Node.js</Badge>
                    <Badge variant="outline" className="text-xs">SQL</Badge>
                    <Badge variant="outline" className="text-xs">Git</Badge>
                    <Badge variant="outline" className="text-xs">UI/UX Design</Badge>
                    <Badge variant="outline" className="text-xs">Machine Learning</Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Goals</h4>
                  <p>Aspiring to become a software engineer with expertise in building scalable web applications. Passionate about creating user-centered solutions and contributing to impactful technology projects.</p>
                </div>
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