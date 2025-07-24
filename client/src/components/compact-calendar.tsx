import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from "date-fns";
import type { Task } from "@shared/schema";

interface CompactCalendarProps {
  tasks: Task[];
}

export function CompactCalendar({ tasks }: CompactCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), date);
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
  };

  // Create a grid starting from Sunday
  const startDay = monthStart.getDay();
  const emptyDays = Array.from({ length: startDay }, (_, i) => i);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h4>
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="h-6 w-6 p-0"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="h-6 w-6 p-0"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid - Compact version */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="h-8 p-1"></div>
        ))}
        
        {/* Days of the month */}
        {daysInMonth.map((day) => {
          const dayTasks = getTasksForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);
          
          return (
            <div
              key={day.toISOString()}
              className={`h-8 p-1 rounded text-center relative ${
                isTodayDate 
                  ? 'bg-primary text-white font-medium' 
                  : isCurrentMonth 
                  ? 'text-gray-900 hover:bg-gray-100' 
                  : 'text-gray-400'
              }`}
            >
              <div className="text-xs">
                {format(day, 'd')}
              </div>
              
              {/* Task indicator dots */}
              {dayTasks.length > 0 && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                  {dayTasks.slice(0, 3).map((task, index) => (
                    <div
                      key={index}
                      className={`w-1 h-1 rounded-full ${
                        task.priority === 'high' 
                          ? 'bg-red-500' 
                          : task.priority === 'medium' 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                      }`}
                      title={task.title}
                    />
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="w-1 h-1 rounded-full bg-gray-400" title={`+${dayTasks.length - 3} more`} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick stats */}
      <div className="flex justify-between text-xs text-gray-600 pt-2 border-t border-gray-200">
        <span>{tasks.filter(t => t.status === 'open').length} active tasks</span>
        <span>{tasks.filter(t => {
          if (!t.dueDate) return false;
          const today = new Date();
          const taskDate = new Date(t.dueDate);
          return taskDate.toDateString() === today.toDateString();
        }).length} due today</span>
      </div>
    </div>
  );
}