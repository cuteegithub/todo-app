import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Task } from "@shared/schema";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSwipeActive, setIsSwipeActive] = useState(false);

  const updateTaskMutation = useMutation({
    mutationFn: async (updates: Partial<Task>) => {
      await apiRequest("PATCH", `/api/tasks/${task.id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/tasks/${task.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    },
  });

  const toggleTaskStatus = () => {
    const newStatus = task.status === "completed" ? "open" : "completed";
    updateTaskMutation.mutate({ status: newStatus });
    
    if (newStatus === "completed") {
      toast({
        title: "Task completed!",
        description: "Great job finishing this task",
      });
    } else {
      toast({
        title: "Task reopened",
        description: "Task marked as active",
      });
    }
  };

  const deleteTask = () => {
    deleteTaskMutation.mutate();
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case "high":
        return "border-error";
      case "medium":
        return "border-yellow-500";
      case "low":
        return "border-success";
      default:
        return "border-gray-200";
    }
  };

  const getPriorityTextColor = () => {
    switch (task.priority) {
      case "high":
        return "text-error";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-success";
      default:
        return "text-text-secondary";
    }
  };

  const formatDueDate = () => {
    if (!task.dueDate) return null;
    
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dueDate.toDateString() === today.toDateString()) {
      return `Due ${dueDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`;
    } else if (dueDate.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else if (dueDate < today) {
      return "Overdue";
    } else {
      return dueDate.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const isCompleted = task.status === "completed";
  const dueDateDisplay = formatDueDate();

  return (
    <div className={`task-item bg-surface rounded-lg p-4 shadow-sm border-l-4 ${getPriorityColor()} relative transition-transform duration-200 ${isSwipeActive ? 'transform -translate-x-20' : ''} ${isCompleted ? 'opacity-60' : ''}`}>
      <div className="flex items-start space-x-3">
        <button
          onClick={toggleTaskStatus}
          className={`mt-1 w-6 h-6 border-2 rounded-full flex items-center justify-center transition-colors ${
            isCompleted
              ? 'bg-success border-success'
              : 'border-text-secondary hover:border-primary'
          }`}
          disabled={updateTaskMutation.isPending}
        >
          {isCompleted && (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-text-primary font-medium text-base mb-1 ${isCompleted ? 'line-through' : ''}`}>
            {task.title}
          </h4>
          {task.description && (
            <p className={`text-text-secondary text-sm mb-2 ${isCompleted ? 'line-through' : ''}`}>
              {task.description}
            </p>
          )}
          <div className="flex items-center space-x-4 text-xs">
            <span className={`flex items-center ${getPriorityTextColor()}`}>
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>
              </svg>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
            </span>
            {dueDateDisplay && (
              <span className="flex items-center text-text-secondary">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                  <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                {dueDateDisplay}
              </span>
            )}
            {isCompleted && (
              <span className="flex items-center text-success">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Completed
              </span>
            )}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1 h-auto">
              <svg className="w-5 h-5 text-text-secondary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toast({ title: "Edit", description: "Edit feature coming soon!" })}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={deleteTask}
              className="text-error focus:text-error"
              disabled={deleteTaskMutation.isPending}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {deleteTaskMutation.isPending ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
