import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { AccessToken } from "livekit-server-sdk";

dotenv.config();

const app = express();

// ------------------------------------
// MIDDLEWARE
// ------------------------------------

app.use(cors());
app.use(express.json());

// ------------------------------------
// BASIC TEST ROUTE
// ------------------------------------

app.get("/", (req, res) => {
  res.send("Smart Meet server is working!");
});

// ------------------------------------
// LIVEKIT TOKEN ROUTE
// ------------------------------------

app.get("/api/livekit/token", async (req, res) => {
  try {
    const { room, identity } = req.query;

    // Check room
    if (!room) {
      return res.status(400).json({
        error: "Room name is required",
      });
    }

    // Check identity
    if (!identity) {
      return res.status(400).json({
        error: "User identity is required",
      });
    }

    // Check environment variables
    if (
      !process.env.LIVEKIT_API_KEY ||
      !process.env.LIVEKIT_API_SECRET ||
      !process.env.LIVEKIT_URL
    ) {
      console.error("LiveKit environment variables are missing.");

      return res.status(500).json({
        error: "LiveKit server configuration is missing",
      });
    }

    // Create access token
    const token = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: identity,
      }
    );

    // Give user permission to join the room
    token.addGrant({
      roomJoin: true,
      room: room,
      canPublish: true,
      canSubscribe: true,
    });

    // Convert token to JWT
    const jwt = await token.toJwt();

    console.log(
      `LiveKit token created | Room: ${room} | User: ${identity}`
    );

    // Send token to frontend
    res.json({
      token: jwt,
      serverUrl: process.env.LIVEKIT_URL,
    });

  } catch (error) {
    console.error("LiveKit token error:", error);

    res.status(500).json({
      error: "Failed to generate LiveKit token",
    });
  }
});

// ------------------------------------
// START SERVER
// ------------------------------------

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Smart Meet server running on port ${PORT}`);
});