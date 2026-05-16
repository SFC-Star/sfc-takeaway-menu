const KITCHEN_NUMBERS = ["918209531318", "918619973534"];
const PACKAGING_CHARGE = 0;

const DEFAULT_MENU = [
  { id: "veg-burger", name: "Veg Burger", category: "Burgers", price: 59, desc: "Crisp patty, fresh salad, house sauce." },
  { id: "cheese-burger", name: "Cheese Burger", category: "Burgers", price: 79, desc: "Veg patty with cheese and SFC sauce." },
  { id: "chicken-burger", name: "Chicken Burger", category: "Burgers", price: 99, desc: "Crispy chicken fillet with classic dressing." },
  { id: "zinger-burger", name: "Zinger Burger", category: "Burgers", price: 129, desc: "Spicy crunchy chicken with mayo." },
  { id: "french-fries", name: "French Fries", category: "Sides", price: 69, desc: "Salted fries, made for quick takeaway." },
  { id: "peri-fries", name: "Peri Peri Fries", category: "Sides", price: 89, desc: "Fries tossed with peri peri seasoning." },
  { id: "veg-nuggets", name: "Veg Nuggets", category: "Sides", price: 89, desc: "Golden fried bites with dip." },
  { id: "chicken-popcorn", name: "Chicken Popcorn", category: "Chicken", price: 129, desc: "Bite-size crispy chicken pieces." },
  { id: "chicken-strips", name: "Chicken Strips", category: "Chicken", price: 149, desc: "Crunchy chicken strips with dip." },
  { id: "fried-chicken-2pc", name: "Fried Chicken 2 Pc", category: "Chicken", price: 179, desc: "Signature crispy fried chicken." },
  { id: "fried-chicken-4pc", name: "Fried Chicken 4 Pc", category: "Chicken", price: 329, desc: "Family-size crispy chicken serving." },
  { id: "veg-wrap", name: "Veg Wrap", category: "Wraps", price: 89, desc: "Veg patty, sauces, and salad in a soft wrap." },
  { id: "chicken-wrap", name: "Chicken Wrap", category: "Wraps", price: 119, desc: "Crispy chicken wrap with house dressing." },
  { id: "paneer-wrap", name: "Paneer Wrap", category: "Wraps", price: 129, desc: "Paneer bites with fresh filling." },
  { id: "veg-momos", name: "Veg Momos", category: "Momos", price: 79, desc: "Steamed veg momos with spicy dip." },
  { id: "chicken-momos", name: "Chicken Momos", category: "Momos", price: 109, desc: "Steamed chicken momos with dip." },
  { id: "white-sauce-pasta", name: "White Sauce Pasta", category: "Pasta", price: 149, desc: "Creamy pasta with herbs and vegetables." },
  { id: "red-sauce-pasta", name: "Red Sauce Pasta", category: "Pasta", price: 139, desc: "Tangy tomato pasta with seasoning." },
  { id: "cold-coffee", name: "Cold Coffee", category: "Beverages", price: 79, desc: "Chilled coffee shake." },
  { id: "masala-lemonade", name: "Masala Lemonade", category: "Beverages", price: 49, desc: "Fresh lemon drink with masala." }
];

let menu = JSON.parse(localStorage.getItem("sfc_menu") || "null") || DEFAULT_MENU;
let cart = {};
let activeCategory = "All";
let lastReceipt = null;

const rupee = (value) => `Rs ${Math.round(value)}`;
const byId = (id) => document.getElementById(id);

function categories() {
  return ["All", ...Array.from(new Set(menu.map((item) => item.category)))];
}

function renderCategories() {
  byId("categoryChips").innerHTML = categories().map((cat) => (
    `<button class="chip ${cat === activeCategory ? "active" : ""}" data-category="${cat}">${cat}</button>`
  )).join("");
}

function renderMenu() {
  const query = byId("searchInput").value.trim().toLowerCase();
  const filtered = menu.filter((item) => {
    const categoryMatch = activeCategory === "All" || item.category === activeCategory;
    const searchMatch = !query || `${item.name} ${item.category} ${item.desc}`.toLowerCase().includes(query);
    return categoryMatch && searchMatch;
  });

  byId("menuGrid").innerHTML = filtered.map((item) => `
    <article class="item-card">
      <div>
        <div class="item-title">${item.name}</div>
        <div class="item-meta">${item.category} · ${item.desc}</div>
      </div>
      <div class="item-foot">
        <span class="price">${rupee(item.price)}</span>
        <button class="add-btn" data-add="${item.id}">Add</button>
      </div>
    </article>
  `).join("") || `<p>No menu items found.</p>`;
}

function cartLines() {
  return Object.entries(cart)
    .map(([id, qty]) => ({ ...menu.find((item) => item.id === id), qty }))
    .filter((item) => item.id);
}

function totals() {
  const subtotal = cartLines().reduce((sum, item) => sum + item.price * item.qty, 0);
  const packaging = subtotal > 0 ? PACKAGING_CHARGE : 0;
  return { subtotal, packaging, total: subtotal + packaging };
}

function renderCart() {
  const lines = cartLines();
  byId("cartItems").innerHTML = lines.map((item) => `
    <div class="cart-row">
      <div><strong>${item.name}</strong><br><small>${rupee(item.price)} each</small></div>
      <div class="qty">
        <button data-dec="${item.id}" type="button">-</button>
        <strong>${item.qty}</strong>
        <button data-inc="${item.id}" type="button">+</button>
      </div>
      <strong>${rupee(item.price * item.qty)}</strong>
    </div>
  `).join("") || `<p class="hint">Add items from the menu to prepare the bill.</p>`;

  const bill = totals();
  byId("subtotalText").textContent = rupee(bill.subtotal);
  byId("packagingText").textContent = rupee(bill.packaging);
  byId("totalText").textContent = rupee(bill.total);
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
}

function makeOrder() {
  const lines = cartLines();
  if (!lines.length) throw new Error("Please add at least one item.");
  const now = new Date();
  const order = {
    id: `SFC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`,
    createdAt: now.toISOString(),
    customerName: byId("customerName").value.trim(),
    customerPhone: byId("customerPhone").value.trim(),
    pickupTime: byId("pickupTime").value || "ASAP",
    paymentMode: byId("paymentMode").value,
    notes: byId("orderNotes").value.trim(),
    type: "Takeaway only",
    items: lines,
    ...totals()
  };
  return order;
}

function receiptHtml(order) {
  return `
    <h2>SFC Cloud Kitchen</h2>
    <p><strong>Takeaway bill</strong><br>Order: ${order.id}<br>${new Date(order.createdAt).toLocaleString()}</p>
    <p>Customer: ${order.customerName}<br>Mobile: ${order.customerPhone}<br>Pickup: ${order.pickupTime}<br>Payment: ${order.paymentMode}</p>
    <table>
      <thead><tr><th>Item</th><th>Qty</th><th>Total</th></tr></thead>
      <tbody>${order.items.map((item) => `<tr><td>${item.name}<br><small>${rupee(item.price)}</small></td><td>${item.qty}</td><td>${rupee(item.price * item.qty)}</td></tr>`).join("")}</tbody>
    </table>
    <p>Subtotal: <strong>${rupee(order.subtotal)}</strong><br>Packaging: <strong>${rupee(order.packaging)}</strong></p>
    <h3>Final bill: ${rupee(order.total)}</h3>
    ${order.notes ? `<p>Notes: ${order.notes}</p>` : ""}
    <p>No home delivery. Please collect from counter.</p>
  `;
}

function whatsappMessage(order) {
  const items = order.items.map((item) => `• ${item.name} x ${item.qty} = ${rupee(item.price * item.qty)}`).join("\n");
  return [
    `SFC TAKEAWAY ORDER`,
    `Order: ${order.id}`,
    `Name: ${order.customerName}`,
    `Phone: ${order.customerPhone}`,
    `Pickup: ${order.pickupTime}`,
    `Payment: ${order.paymentMode}`,
    ``,
    items,
    ``,
    `Subtotal: ${rupee(order.subtotal)}`,
    `Packaging: ${rupee(order.packaging)}`,
    `FINAL BILL: ${rupee(order.total)}`,
    order.notes ? `Notes: ${order.notes}` : "",
    `Takeaway only. No home delivery.`
  ].filter(Boolean).join("\n");
}

function saveOrder(order) {
  const orders = JSON.parse(localStorage.getItem("sfc_orders") || "[]");
  orders.unshift(order);
  localStorage.setItem("sfc_orders", JSON.stringify(orders));
}

function showReceipt(order) {
  lastReceipt = order;
  byId("receiptContent").innerHTML = receiptHtml(order);
  const encoded = encodeURIComponent(whatsappMessage(order));
  byId("whatsappButtons").innerHTML = KITCHEN_NUMBERS.map((num) => (
    `<a target="_blank" rel="noopener" href="https://wa.me/${num}?text=${encoded}">Send to WhatsApp ${num.slice(-10)}</a>`
  )).join("");
  byId("receiptDialog").showModal();
}

function renderOrders() {
  const orders = JSON.parse(localStorage.getItem("sfc_orders") || "[]");
  byId("ordersTable").innerHTML = `
    <table>
      <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Time</th></tr></thead>
      <tbody>
        ${orders.map((order) => `
          <tr>
            <td>${order.id}<br><small>${order.type}</small></td>
            <td>${order.customerName}<br><small>${order.customerPhone}</small></td>
            <td>${order.items.map((item) => `${item.name} x ${item.qty}`).join("<br>")}</td>
            <td><strong>${rupee(order.total)}</strong><br><small>${order.paymentMode}</small></td>
            <td>${new Date(order.createdAt).toLocaleString()}<br><small>Pickup: ${order.pickupTime}</small></td>
          </tr>
        `).join("") || `<tr><td colspan="5">No orders yet.</td></tr>`}
      </tbody>
    </table>
  `;
}

function renderMenuEditor() {
  byId("menuEditor").value = JSON.stringify(menu, null, 2);
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportCsv() {
  const orders = JSON.parse(localStorage.getItem("sfc_orders") || "[]");
  const rows = [["Order ID", "Date", "Name", "Phone", "Pickup", "Payment", "Items", "Subtotal", "Packaging", "Total", "Notes"]];
  orders.forEach((order) => rows.push([
    order.id,
    new Date(order.createdAt).toLocaleString(),
    order.customerName,
    order.customerPhone,
    order.pickupTime,
    order.paymentMode,
    order.items.map((item) => `${item.name} x ${item.qty}`).join("; "),
    order.subtotal,
    order.packaging,
    order.total,
    order.notes || ""
  ]));
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  downloadFile("sfc-orders.csv", csv, "text/csv");
}

function bindEvents() {
  byId("categoryChips").addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    renderCategories();
    renderMenu();
  });

  byId("menuGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");
    if (button) addToCart(button.dataset.add);
  });

  byId("cartItems").addEventListener("click", (event) => {
    const inc = event.target.closest("[data-inc]");
    const dec = event.target.closest("[data-dec]");
    if (inc) cart[inc.dataset.inc] = (cart[inc.dataset.inc] || 0) + 1;
    if (dec) {
      cart[dec.dataset.dec] = Math.max((cart[dec.dataset.dec] || 1) - 1, 0);
      if (!cart[dec.dataset.dec]) delete cart[dec.dataset.dec];
    }
    renderCart();
  });

  byId("searchInput").addEventListener("input", renderMenu);
  byId("clearCartBtn").addEventListener("click", () => { cart = {}; renderCart(); });
  byId("checkoutForm").addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      const order = makeOrder();
      saveOrder(order);
      showReceipt(order);
      cart = {};
      byId("checkoutForm").reset();
      renderCart();
    } catch (error) {
      alert(error.message);
    }
  });

  byId("closeReceiptBtn").addEventListener("click", () => byId("receiptDialog").close());
  byId("printReceiptBtn").addEventListener("click", () => window.print());
  byId("adminToggle").addEventListener("click", () => {
    renderOrders();
    renderMenuEditor();
    byId("adminDialog").showModal();
  });
  byId("closeAdminBtn").addEventListener("click", () => byId("adminDialog").close());
  byId("exportCsvBtn").addEventListener("click", exportCsv);
  byId("exportJsonBtn").addEventListener("click", () => downloadFile("sfc-orders.json", localStorage.getItem("sfc_orders") || "[]", "application/json"));
  byId("clearOrdersBtn").addEventListener("click", () => {
    if (confirm("Clear all stored orders on this device?")) {
      localStorage.removeItem("sfc_orders");
      renderOrders();
    }
  });
  byId("makeQrBtn").addEventListener("click", () => {
    const url = byId("qrUrl").value.trim() || location.href;
    const src = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(url)}`;
    byId("qrPreview").innerHTML = `<img alt="QR code for menu" src="${src}"><p class="hint">${url}</p>`;
  });
  byId("saveMenuBtn").addEventListener("click", () => {
    try {
      const nextMenu = JSON.parse(byId("menuEditor").value);
      if (!Array.isArray(nextMenu) || !nextMenu.every((item) => item.id && item.name && item.category && Number.isFinite(Number(item.price)))) {
        throw new Error("Each menu item needs id, name, category, and price.");
      }
      menu = nextMenu.map((item) => ({ ...item, price: Number(item.price), desc: item.desc || "" }));
      localStorage.setItem("sfc_menu", JSON.stringify(menu));
      activeCategory = "All";
      cart = {};
      renderCategories();
      renderMenu();
      renderCart();
      alert("Menu saved on this device.");
    } catch (error) {
      alert(`Menu not saved: ${error.message}`);
    }
  });
  byId("resetMenuBtn").addEventListener("click", () => {
    if (confirm("Reset menu to the sample SFC list on this device?")) {
      menu = DEFAULT_MENU;
      localStorage.removeItem("sfc_menu");
      renderMenuEditor();
      renderCategories();
      renderMenu();
      renderCart();
    }
  });
}

renderCategories();
renderMenu();
renderCart();
bindEvents();
