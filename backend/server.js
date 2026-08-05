require("dotenv").config();

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const csv = require("csv-parser");
const XLSX = require("xlsx");
const path = require("path");
const cors = require("cors");


const OpenAI = require("openai");


console.log("API KEY:", process.env.OPENAI_API_KEY); // ✅ debug

const app = express();
app.use(cors());
app.use(express.json());

// ================== 🔐 LOGIN ROUTE ==================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Demo user (you can upgrade later)
  if (email === "test@test.com" && password === "1234") {
    return res.json({
      success: true,
      user: { email }
    });
  }

  res.json({
    success: false,
    message: "Invalid credentials ❌"
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// ✅ 1GB support
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 }
});

// 🤖 OPENAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// ================== ✅ UPLOAD ROUTE ==================
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = req.file.originalname.toLowerCase();

    let data = [];

    // 📄 CSV
    if (fileName.endsWith(".csv")) {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => data.push(row))
        .on("end", () => {
          res.json({
            data: data.slice(0, 500), // send limited data
            insights: { totalRows: data.length }
          });
        });
    }

    // 📊 EXCEL
    else if (fileName.endsWith(".xlsx")) {
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      data = XLSX.utils.sheet_to_json(sheet);

      res.json({
        data: data.slice(0, 500),
        insights: { totalRows: data.length }
      });
    }

    // 📦 JSON
    else if (fileName.endsWith(".json")) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      data = JSON.parse(fileContent);

      res.json({
        data: data.slice(0, 500),
        insights: { totalRows: data.length }
      });
    }

    else {
      res.status(400).json({ error: "Unsupported file ❌" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed ❌" });
  }
});


// ================== 🤖 AI ROUTE ==================
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/analyze", async (req, res) => {
  try {
    const { question, data } = req.body;

    const prompt = `
You are a smart data analyst AI.

Data:
${JSON.stringify(data.slice(0, 30))}

Question:
${question}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      reply: response.choices[0].message.content,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "AI failed" });
  }
});

// ================== SERVER ==================
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000 🚀");
});