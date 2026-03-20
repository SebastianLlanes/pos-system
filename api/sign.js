import crypto from "crypto";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { toSign }  = req.body;
    const privateKey  = process.env.QZ_PRIVATE_KEY.replace(/\\n/g, "\n");

    const sign        = crypto.createSign("SHA512");
    sign.update(toSign);
    const signature   = sign.sign(privateKey, "base64");

    res.status(200).json({ signature });
  } catch (err) {
    console.error("Error al firmar:", err);
    res.status(500).json({ error: "Error al firmar" });
  }
}
