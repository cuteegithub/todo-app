import {
  users,
  tasks,
  type User,
  type UpsertUser,
  type Task,
  type InsertTask,
  type UpdateTask,
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Task operations
  getUserTasks(userId: string): Promise<Task[]>;
  createTask(userId: string, task: InsertTask): Promise<Task>;
  updateTask(taskId: number, userId: string, updates: UpdateTask): Promise<Task | undefined>;
  deleteTask(taskId: number, userId: string): Promise<boolean>;
  getTask(taskId: number, userId: string): Promise<Task | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tasks: Map<number, Task>;
  private currentTaskId: number;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.currentTaskId = 1;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id);
    const user: User = {
      ...userData,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  // Task operations
  async getUserTasks(userId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }

  async createTask(userId: string, taskData: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const task: Task = {
      id,
      userId,
      title: taskData.title,
      description: taskData.description || null,
      dueDate: taskData.dueDate || null,
      status: taskData.status || "open",
      priority: taskData.priority || "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(taskId: number, userId: string, updates: UpdateTask): Promise<Task | undefined> {
    const existingTask = this.tasks.get(taskId);
    if (!existingTask || existingTask.userId !== userId) {
      return undefined;
    }

    const updatedTask: Task = {
      ...existingTask,
      ...updates,
      updatedAt: new Date(),
    };
    this.tasks.set(taskId, updatedTask);
    return updatedTask;
  }

  async deleteTask(taskId: number, userId: string): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task || task.userId !== userId) {
      return false;
    }
    return this.tasks.delete(taskId);
  }

  async getTask(taskId: number, userId: string): Promise<Task | undefined> {
    const task = this.tasks.get(taskId);
    if (!task || task.userId !== userId) {
      return undefined;
    }
    return task;
  }
}

export const storage = new MemStorage();
