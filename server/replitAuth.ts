import session from "express-session";
import type { Express, RequestHandler } from "express";
import MemoryStore from "memorystore";
import { storage } from "./storage";

// For hackathon demo - using memory store instead of PostgreSQL
const memoryStore = MemoryStore(session);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  return session({
    secret: process.env.SESSION_SECRET || 'hackathon-demo-secret-key-2025',
    store: new memoryStore({
      checkPeriod: sessionTtl,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to false for development
      maxAge: sessionTtl,
    },
  });
}

// Demo users for hackathon
const demoUsers = [
  {
    id: "sindhuja-user-1",
    email: "sindhuja@taskflow.com",
    firstName: "Sindhuja",
    lastName: "",
    profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616c9997666?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150&q=80"
  }
];

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Demo login route - automatically logs in as demo user
  app.get("/api/login", async (req: any, res) => {
    const demoUser = demoUsers[0]; // Use first demo user
    
    // Create user in storage
    await storage.upsertUser(demoUser);
    
    // Add some sample tasks for the demo user if they don't exist
    const existingTasks = await storage.getUserTasks(demoUser.id);
    if (existingTasks.length === 0) {
      const sampleTasks = [
        {
          title: "Morning skincare routine",
          description: "Complete 7-step skincare routine with cleanser, toner, serum, and moisturizer",
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
          status: "open",
          priority: "high"
        },
        {
          title: "Study session - Web Development",
          description: "Complete React tutorial chapter 3-5, practice building components",
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 48), // Day after tomorrow
          status: "open",
          priority: "high"
        },
        {
          title: "Yoga and meditation",
          description: "20 minutes yoga followed by 10 minutes mindfulness meditation",
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 6), // 6 hours from now
          status: "open",
          priority: "medium"
        },
        {
          title: "Plan weekend outfit",
          description: "Choose outfit for college fest, coordinate accessories and shoes",
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 72), // 3 days
          status: "open",
          priority: "low"
        },
        {
          title: "Call bestie",
          description: "Catch up with Priya about her internship updates and weekend plans",
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 12), // 12 hours
          status: "completed",
          priority: "medium"
        }
      ];
      
      for (const task of sampleTasks) {
        await storage.createTask(demoUser.id, task);
      }
    }
    
    // Set session
    req.session.user = {
      id: demoUser.id,
      claims: {
        sub: demoUser.id,
        email: demoUser.email,
        first_name: demoUser.firstName,
        last_name: demoUser.lastName,
        profile_image_url: demoUser.profileImageUrl,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 1 week
      }
    };
    
    res.redirect("/");
  });

  app.get("/api/logout", (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        console.error("Session destroy error:", err);
      }
      res.redirect("/");
    });
  });
}

export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  const user = req.session?.user;

  if (!user || !user.claims) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (user.claims.exp && now > user.claims.exp) {
    return res.status(401).json({ message: "Session expired" });
  }

  // Attach user to request
  req.user = user;
  return next();
};