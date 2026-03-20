const express  = require("express");
const cors     = require("cors");
const crypto   = require("crypto");
const fs       = require("fs");
const path     = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/sign", (req, res) => {
  try {
    const { toSign }  = req.body;
    const keyPath     = path.join(__dirname, "../private-key.pem");
    const privateKey  = fs.readFileSync(keyPath, "utf8");
    const sign        = crypto.createSign("SHA512");
    sign.update(toSign);
    const signature   = sign.sign(privateKey, "base64");
    res.json({ signature });
  } catch (err) {
    console.error("Error al firmar:", err);
    res.status(500).json({ error: "Error al firmar" });
  }
});

app.listen(3001, () => console.log("Sign server corriendo en puerto 3001"));