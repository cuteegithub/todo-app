import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertTaskSchema, type InsertTask } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPriority, setSelectedPriority] = useState<"low" | "medium" | "high">("medium");

  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: undefined,
      status: "open",
      priority: "medium",
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: InsertTask) => {
      await apiRequest("POST", "/api/tasks", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Success!",
        description: "Task created successfully",
      });
      onClose();
      form.reset();
      setSelectedPriority("medium");
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
        description: "Failed to create task",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertTask) => {
    createTaskMutation.mutate({
      ...data,
      priority: selectedPriority,
      dueDate: data.dueDate || undefined,
    });
  };

  const handleClose = () => {
    onClose();
    form.reset();
    setSelectedPriority("medium");
  };

  const getPriorityButtonClass = (priority: "low" | "medium" | "high") => {
    const baseClass = "flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors border-2";
    
    if (selectedPriority === priority) {
      switch (priority) {
        case "high":
          return `${baseClass} bg-error text-white border-error`;
        case "medium":
          return `${baseClass} bg-yellow-500 text-white border-yellow-500`;
        case "low":
          return `${baseClass} bg-success text-white border-success`;
      }
    }
    
    switch (priority) {
      case "high":
        return `${baseClass} border-error text-error hover:bg-error hover:text-white`;
      case "medium":
        return `${baseClass} border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white`;
      case "low":
        return `${baseClass} border-success text-success hover:bg-success hover:text-white`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto bottom-0 top-auto translate-y-0 rounded-t-3xl rounded-b-none border-0 p-0 data-[state=open]:slide-in-from-bottom-full">
        <div className="bg-surface w-full rounded-t-3xl">
          {/* Modal Header */}
          <DialogHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-100">
            <DialogTitle className="text-text-primary font-medium text-xl">Add New Task</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-2 h-auto rounded-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </DialogHeader>

          {/* Modal Content */}
          <div className="p-4 pb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Task Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-text-primary font-medium">Task Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter task title"
                          {...field}
                          className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Task Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-text-primary font-medium">Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add task description"
                          rows={3}
                          {...field}
                          value={field.value || ""}
                          className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:border-primary resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Due Date */}
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-text-primary font-medium">Due Date</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                          onChange={(e) => {
                            field.onChange(e.target.value ? new Date(e.target.value) : undefined);
                          }}
                          className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Priority Selection */}
                <div>
                  <label className="block text-text-primary font-medium mb-3">Priority Level</label>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPriority("low")}
                      className={getPriorityButtonClass("low")}
                    >
                      Low
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPriority("medium")}
                      className={getPriorityButtonClass("medium")}
                    >
                      Medium
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPriority("high")}
                      className={getPriorityButtonClass("high")}
                    >
                      High
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 py-4 px-6 h-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createTaskMutation.isPending}
                    className="flex-1 py-4 px-6 bg-primary text-white h-auto hover:bg-primary-dark"
                  >
                    {createTaskMutation.isPending ? "Creating..." : "Create Task"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
