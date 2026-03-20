import qz from "qz-tray";


// ── Conexión ──────────────────────────────────────────────
export const connectPrinter = async () => {
  if (qz.websocket.isActive()) return;
  await qz.websocket.connect();
};

export const disconnectPrinter = async () => {
  if (!qz.websocket.isActive()) return;
  await qz.websocket.disconnect();
};

export const listPrinters = async () => {
  await connectPrinter();
  const printers = await qz.printers.find();
  console.log("Impresoras disponibles:", printers);
  return printers;
};

// ── Helpers ───────────────────────────────────────────────
const center = (text, width = 32) => {
  const spaces = Math.max(0, Math.floor((width - text.length) / 2));
  return " ".repeat(spaces) + text;
};

const line = "--------------------------------\n";

const PAYMENT_LABELS = {
  cash:     "Efectivo",
  debit:    "Debito",
  credit:   "Credito",
  qr:       "QR",
  transfer: "Transferencia",
};

// ── Ticket simple ─────────────────────────────────────────
export const printTicket = async ({ items, total, payments, customerName }) => {
  await connectPrinter();

  const printer = "Text Only / Querer-T";
  const config  = qz.configs.create(printer, { scaleContent: false });
  const date    = new Date().toLocaleString("es-AR");
  const name    = customerName?.trim();

  const data = [
    "\x1B\x40", // inicializar impresora
    "\x1B\x61\x01", // centrar

    // Encabezado
    line,
    "* * *  Querer-T  * * *\n",
    "Panaderia & Pasteleria\n",
    line,

    // Fecha y cliente
    center(date) + "\n",
    name ? center(`Cliente: ${name}`) + "\n" : "",
    line,

    "\x1B\x61\x00", // izquierda

    // Detalle de items
    ...items.map((item) => {
      const nombre = item.name.substring(0, 20).padEnd(20);
      const precio = `$${item.subtotal.toLocaleString()}`.padStart(12);
      let detalle = "";
      if (item.type === "weight") {
        detalle = `  ${item.grams}gr x $${item.pricePerKg?.toLocaleString()}/kg\n`;
      } else if (item.type === "variants") {
        detalle = `  ${item.variantName}\n`;
      }
      if (item.discountAmount > 0) {
        detalle += `  Descto: -$${item.discountAmount.toLocaleString()}\n`;
      }
      return `${nombre}${precio}\n${detalle}`;
    }),

    line,

    // Medios de pago
    ...payments.map((p) => {
      const label = PAYMENT_LABELS[p.method] ?? p.method;
      const metodo = label.padEnd(20);
      const monto = `$${p.amount.toLocaleString()}`.padStart(12);
      return `${metodo}${monto}\n`;
    }),

    line,

    // Total
    "\x1B\x21\x10", // doble ancho
    `TOTAL  $${total.toLocaleString()}\n`,
    "\x1B\x21\x00", // texto normal

    line,

    // Pie
    "\x1B\x61\x01", // centrar
    name
      ? `Gracias ${name},\nte esperamos nuevamente!\n`
      : "Gracias por tu compra!\n",
    "\n",
    line,
    "* * *  Querer-T  * * *\n",
    line,

    "\n\n\n",
    "\x1D\x56\x41\x10", // corte de papel
  ];

  await qz.print(config, data);
};