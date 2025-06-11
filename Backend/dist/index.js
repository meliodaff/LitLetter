"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const genai_1 = require("@google/genai");
const app = (0, express_1.default)();
const port = 3000;
dotenv_1.default.config();
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
function literatureConverter(message, isSpicy, genre) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `You are a literary expert and skilled writer. I am a husband who wants to send a heartfelt message to my wife. Please rewrite the following text as a piece of ${genre} literature. Ensure the style, tone, and structure match the chosen genre. Make the result ${isSpicy ? "provocative and intense" : "appropriate for all audiences"}, and return only the rewritten content in 3 to 5 sentences. Original text: "${message}"`,
        });
        if (!response.text)
            return "It returned falsy value";
        return response.text;
    });
}
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message, isSpicy, genre } = req.body;
    try {
        const response = yield literatureConverter(message, isSpicy, genre);
        res.status(200).json({ message: response });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}));
app.listen(port, (err) => {
    if (err)
        throw err;
    console.log(`server running at port ${port}`);
});
