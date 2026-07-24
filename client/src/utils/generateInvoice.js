import jsPDF from "jspdf";

export const generateInvoice = (order, user) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.setFont(undefined, "bold");
  doc.text("Ecommerce Store", 14, 20);

  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text("Invoice", 14, 27);

  doc.setFontSize(10);
  doc.text(`Order ID: #${order._id.slice(-8)}`, 14, 40);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 46);
  doc.text(`Payment ID: ${order.paymentId || "N/A"}`, 14, 52);

  doc.text("Bill To:", 140, 40);
  doc.text(order.shippingAddress?.fullName || user?.name || "", 140, 46);
  doc.text(order.shippingAddress?.address || "", 140, 52);
  doc.text(`${order.shippingAddress?.city || ""}, ${order.shippingAddress?.postalCode || ""}`, 140, 58);
  doc.text(order.shippingAddress?.country || "", 140, 64);

  let y = 80;
  doc.setFont(undefined, "bold");
  doc.text("Item", 14, y);
  doc.text("Qty", 120, y);
  doc.text("Price", 145, y);
  doc.text("Total", 175, y);
  doc.line(14, y + 2, 196, y + 2);
  doc.setFont(undefined, "normal");

  y += 10;
  order.items.forEach((item) => {
    doc.text(item.name.substring(0, 40), 14, y);
    doc.text(String(item.quantity), 120, y);
    doc.text(`Rs.${item.price}`, 145, y);
    doc.text(`Rs.${item.price * item.quantity}`, 175, y);
    y += 8;
  });

  y += 4;
  doc.line(14, y, 196, y);
  y += 8;

  const subtotal = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = order.totalAmount - subtotal > 0 ? order.totalAmount - subtotal : 0;

  doc.text("Subtotal:", 145, y);
  doc.text(`Rs.${subtotal}`, 175, y);
  y += 7;
  doc.text("Tax/Shipping:", 145, y);
  doc.text(`Rs.${tax}`, 175, y);
  y += 7;
  doc.setFont(undefined, "bold");
  doc.text("Total:", 145, y);
  doc.text(`Rs.${order.totalAmount}`, 175, y);

  y += 20;
  doc.setFont(undefined, "normal");
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("Thank you for shopping with us!", 14, y);

  doc.save(`invoice-${order._id.slice(-8)}.pdf`);
};