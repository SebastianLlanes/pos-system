const qz = window.qz;

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
export const printTicket = async ({ items, total, payments, customerName, change = 0 }) => {
  await connectPrinter();

  const printer = "Text Only / Querer-T";
  const config = qz.configs.create(printer, { 
  scaleContent: false,
  rawCommands: true,
  encoding: "UTF-8"
});
  const date    = new Date().toLocaleString("es-AR");
  const name    = customerName?.trim();

  const data = [
    "\x1B\x40",
    "\x1B\x61\x01",

    line,
    "* * *  Querer-T  * * *\n",
    "Panaderia & Pasteleria\n",
    line,

    center(date) + "\n",
    name ? center(`Cliente: ${name}`) + "\n" : "",
    line,

    "\x1B\x61\x00",

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

    ...payments.map((p) => {
      const label  = PAYMENT_LABELS[p.method] ?? p.method;
      const metodo = label.padEnd(20);
      const monto  = `$${p.amount.toLocaleString()}`.padStart(12);
      return `${metodo}${monto}\n`;
    }),

    // Vuelto
    change > 0 ? `${"Vuelto".padEnd(20)}$${change.toLocaleString().padStart(11)}\n` : "",

    line,

    "\x1B\x21\x10",
    `TOTAL  $${total.toLocaleString()}\n`,
    "\x1B\x21\x00",

    line,

    "\x1B\x61\x01",
    name
      ? `Gracias ${name},\nte esperamos nuevamente!\n`
      : "Gracias por tu compra!\n",
    "\n",
    line,
    "* * *  Querer-T  * * *\n",
    line,

    "\n\n\n",
    "\x1D\x56\x41\x10",
  ];

  await qz.print(config, data);
};

export const printCashClosing = async ({ salesCount, systemTotal, paymentBreakdown, sales }) => {
  await connectPrinter();

  const printer = "Text Only / Querer-T";
  const config  = qz.configs.create(printer, { scaleContent: false, rawCommands: true, encoding: "UTF-8" });
  const date    = new Date().toLocaleString("es-AR");

  // Top 5 productos más vendidos
  const productCount = {};
  sales.forEach((sale) => {
    sale.items?.forEach((item) => {
      const key = item.name;
      if (!productCount[key]) productCount[key] = 0;
      productCount[key] += item.quantity ?? 1;
    });
  });
  const top5 = Object.entries(productCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Ventas de familia
  // Las ventas de familia no llegan en sales (ya filtradas), necesitamos el total excluido
  const data = [
    "\x1B\x40",
    "\x1B\x61\x01",

    line,
    "* * *  Querer-T  * * *\n",
    "   Cierre de caja\n",
    center(date) + "\n",
    line,

    "\x1B\x61\x00",

    "VENTAS\n",
    `Cantidad: ${salesCount}\n`,
    `Total:    $${systemTotal.toLocaleString()}\n`,
    line,

    "MEDIOS DE PAGO\n",
    ...Object.entries(paymentBreakdown)
      .filter(([, amount]) => amount > 0)
      .map(([method, amount]) => {
        const label  = PAYMENT_LABELS[method] ?? method;
        const metodo = label.padEnd(14);
        const monto  = `$${amount.toLocaleString()}`.padStart(18);
        return `${metodo}${monto}\n`;
      }),
    line,

    "TOP 5 PRODUCTOS\n",
    ...top5.map(([name, qty], i) => {
      const rank    = `${i + 1}. `.padEnd(4);
      const nombre  = name.substring(0, 18).padEnd(18);
      const cant    = `x${qty}`.padStart(10);
      return `${rank}${nombre}${cant}\n`;
    }),
    line,

    "\x1B\x61\x01",
    "* * *  Querer-T  * * *\n",
    line,

    "\n\n\n",
    "\x1D\x56\x41\x10",
  ];

  await qz.print(config, data);
};

export const printHistoricalClosing = async (closing) => {
  await connectPrinter();

  const printer = "Text Only / Querer-T";
  const config  = qz.configs.create(printer, { scaleContent: false, rawCommands: true, encoding: "UTF-8" });

  const PAYMENT_LABELS = {
    cash:     "Efectivo",
    debit:    "Debito",
    credit:   "Credito",
    qr:       "QR",
    transfer: "Transferencia",
  };

  const isPositive = closing.difference >= 0;

  const data = [
    "\x1B\x40",
    "\x1B\x61\x01",

    line,
    "* * *  Querer-T  * * *\n",
    "   Cierre de caja\n",
    center(closing.date) + "\n",
    line,

    "\x1B\x61\x00",

    "VENTAS\n",
    `Cantidad: ${closing.salesCount}\n`,
    `Sistema:  $${closing.systemTotal?.toLocaleString()}\n`,
    `Declarado:$${closing.declaredTotal?.toLocaleString()}\n`,
    `Diferencia:${isPositive ? "+" : ""}${closing.difference?.toLocaleString()}\n`,
    line,

    "MEDIOS DE PAGO\n",
    ...Object.entries(closing.paymentBreakdown ?? {})
      .filter(([, amount]) => amount > 0)
      .map(([method, amount]) => {
        const label  = PAYMENT_LABELS[method] ?? method;
        const metodo = label.padEnd(14);
        const monto  = `$${amount.toLocaleString()}`.padStart(18);
        return `${metodo}${monto}\n`;
      }),
    line,

    closing.notes ? `Notas: ${closing.notes}\n${line}` : "",

    "\x1B\x61\x01",
    "* * *  Querer-T  * * *\n",
    line,

    "\n\n\n",
    "\x1D\x56\x41\x10",
  ];

  await qz.print(config, data);
};