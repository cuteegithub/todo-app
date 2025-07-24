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
    lastName: "Sharma",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sindhuja&backgroundColor=b6e3f4&clothesColor=262e33&topType=LongHairStraight&accessoriesType=Prescription02&hatColor=PastelBlue&hairColor=BrownDark&facialHairType=Blank&clothesType=BlazerShirt&eyeType=Happy&eyebrowType=Default&mouthType=Smile&skinColor=Light"
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