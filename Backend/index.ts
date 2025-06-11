import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
const port = 3000;
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function literatureConverter(
  message: string,
  isSpicy: boolean,
  genre: string
): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `You are a literary expert and skilled writer. I am a husband who wants to send a heartfelt message to my wife. Please rewrite the following text as a piece of ${genre} literature. Ensure the style, tone, and structure match the chosen genre. Make the result ${
      isSpicy ? "provocative and intense" : "appropriate for all audiences"
    }, and return only the rewritten content in 3 to 5 sentences. Original text: "${message}"`,
  });
  if (!response.text) return "It returned falsy value";
  return response.text;
}

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://litletter.netlify.app/"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("server for lit letter is up");
});

app.post("/", async (req, res) => {
  const { message, isSpicy, genre } = req.body as {
    message: string;
    isSpicy: boolean;
    genre: string;
  };
  try {
    const response = await literatureConverter(message, isSpicy, genre);
    res.status(200).json({ message: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`server running at port ${port}`);
});
