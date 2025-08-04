import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { client } from "store/client";

const router = Router();

// Validation schemas
const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username must not exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
});

const signinSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// User registration
router.post("/signup", async (req, res) => {
  try {
    const parsedData = signupSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        error: "Invalid input data",
        details: parsedData.error.issues.map(issue => ({
          field: issue.path[0],
          message: issue.message
        }))
      });
    }

    // Check if username already exists
    const existingUser = await client.user.findFirst({
      where: { username: parsedData.data.username },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Username already exists"
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(parsedData.data.password, saltRounds);

    // Create user
    const user = await client.user.create({
      data: {
        username: parsedData.data.username,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      userId: user.id,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      error: "Internal server error during user creation"
    });
  }
});

// User login
router.post("/signin", async (req, res) => {
  try {
    const parsedData = signinSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        error: "Invalid input data",
        details: parsedData.error.issues.map(issue => ({
          field: issue.path[0],
          message: issue.message
        }))
      });
    }

    // Find user by username
    const user = await client.user.findFirst({
      where: { username: parsedData.data.username },
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid username or password"
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(parsedData.data.password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid username or password"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' } // Token expires in 7 days
    );

    res.json({
      Token: token,
      message: "Login successful"
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({
      error: "Internal server error during authentication"
    });
  }
});

export default router;
