const KITCHEN_NUMBERS = ["918209531318", "918619973534"];
const PACKAGING_CHARGE = 0;
const MENU_VERSION = "veg-menu-2026-05-17-v2";
const ADMIN_PASSWORD_CODE = "S2lycm9uQDI1MjAwMQ==";

const DEFAULT_MENU = [
  { id: "strawberry-shake", name: "Strawberry Shake", category: "Shakes", price: 79, desc: "Pure veg shake." },
  { id: "pineapple-shake", name: "Pineapple Shake", category: "Shakes", price: 79, desc: "Pure veg shake." },
  { id: "chocolate-shake", name: "Chocolate Shake", category: "Shakes", price: 99, desc: "Pure veg shake." },
  { id: "cold-coffee", name: "Cold Coffee", category: "Shakes", price: 99, desc: "Chilled coffee." },
  { id: "kit-kat-shake", name: "Kit-Kat Shake", category: "Shakes", price: 109, desc: "Pure veg shake." },
  { id: "oreo-shake", name: "Oreo Shake", category: "Shakes", price: 109, desc: "Pure veg shake." },
  { id: "plain-maggi", name: "Plain Maggi", category: "Maggi", price: 49, desc: "Fresh takeaway Maggi." },
  { id: "veg-maggi", name: "Veg Maggi", category: "Maggi", price: 69, desc: "Fresh takeaway Maggi." },
  { id: "masala-maggi", name: "Masala Maggi", category: "Maggi", price: 79, desc: "Fresh takeaway Maggi." },
  { id: "cheese-maggi", name: "Cheese Maggi", category: "Maggi", price: 99, desc: "Fresh takeaway Maggi." },
  { id: "onion-capsicum-pizza", name: "Onion Capsicum Pizza", category: "Pizza", price: 199, desc: "Pure veg pizza." },
  { id: "margherita-pizza", name: "Margherita Pizza", category: "Pizza", price: 249, desc: "Pure veg pizza." },
  { id: "panner-tandoori-pizza", name: "Panner Tandoori Pizza", category: "Pizza", price: 299, desc: "Pure veg pizza." },
  { id: "red-sauce-pasta", name: "Red Sauce Pasta", category: "Italian", price: 255, desc: "Pure veg Italian." },
  { id: "white-sauce-pasta", name: "White Sauce Pasta", category: "Italian", price: 275, desc: "Pure veg Italian." },
  { id: "garlic-bread", name: "Garlic Bread", category: "Italian", price: 175, desc: "Pure veg side." },
  { id: "plain-french-fries", name: "Plain French Fries", category: "French Fries", price: 149, desc: "Crispy veg fries." },
  { id: "masala-french-fries", name: "Masala French Fries", category: "French Fries", price: 185, desc: "Crispy veg fries." },
  { id: "peri-peri-fries", name: "Peri-Peri Fries", category: "French Fries", price: 185, desc: "Crispy veg fries." },
  { id: "veg-sandwich", name: "Veg Sandwich", category: "Sandwich", price: 99, desc: "Pure veg sandwich." },
  { id: "veg-grill-sandwich", name: "Veg Grill Sandwich", category: "Sandwich", price: 129, desc: "Pure veg grilled sandwich." },
  { id: "panner-tandoori-sandwich", name: "Panner Tandoori Sandwich", category: "Sandwich", price: 209, desc: "Pure veg sandwich." },
  { id: "alloo-tikki-sandwich", name: "Alloo Tikki Sandwich", category: "Sandwich", price: 199, desc: "Pure veg sandwich." },
  { id: "veg-burger", name: "Veg Burger", category: "Burger", price: 149, desc: "Pure veg burger." },
  { id: "cheese-burger", name: "Cheese Burger", category: "Burger", price: 175, desc: "Pure veg burger." },
  { id: "paneer-burger", name: "Paneer Burger", category: "Burger", price: 199, desc: "Pure veg burger." },
  { id: "combo-veg-grill-cold-coffee", name: "Veg Grill Sandwich + Cold Coffee", category: "Combo", price: 208, desc: "Combo offer." },
  { id: "combo-panner-tandoori-cold-coffee", name: "Paneer Tandoori Sandwich + Cold Coffee", category: "Combo", price: 288, desc: "Combo offer." },
  { id: "combo-onion-fries-shake", name: "Onion Capsicum Pizza (Medium Size) + Plain French Fries + Strawberry / Pineapple Shake", category: "Combo", price: 399, desc: "Combo offer." },
  { id: "combo-panner-pizza-sandwich-coffee", name: "Paneer Tandoori Pizza (Medium Size) + Veg Grill Sandwich + 2X Cold Coffee", category: "Combo", price: 599, desc: "Combo offer." },
  { id: "combo-veg-maggi-cold-coffee", name: "Veg Maggi + Cold Coffee", category: "Combo", price: 149, desc: "Combo offer." },
  { id: "combo-red-pasta-oreo", name: "Red Sauce Pasta + Oreo Shake", category: "Combo", price: 344, desc: "Combo offer." },
  { id: "combo-white-pasta-kitkat", name: "White Sauce Pasta + Kit-Kat Shake", category: "Combo", price: 364, desc: "Combo offer." },
  { id: "combo-family-veg", name: "Tandoori Paneer Pizza (Medium Size) + Onion Capsicum Pizza (Medium Size) + Red Sauce Pasta + Veg Grill Sandwich + Masala French Fries", category: "Combo", price: 999, desc: "Combo offer." },
  { id: "shake-offer", name: "15% OFF Any Shake x 3", category: "Offer", price: 0, desc: "Choose any shake. Quantity is fixed at 3 and 15% discount is applied automatically." }
];

if (localStorage.getItem("sfc_menu_version") !== MENU_VERSION) {
  localStorage.setItem("sfc_menu", JSON.stringify(DEFAULT_MENU));
  localStorage.setItem("sfc_menu_version", MENU_VERSION);
}

let menu = JSON.parse(localStorage.getItem("sfc_menu") || "null") || DEFAULT_MENU;
let categoryDiscounts = JSON.parse(localStorage.getItem("sfc_category_discounts") || "{}");
let cart = {};
let activeCategory = categories()[0];
let lastReceipt = null;

const rupee = (value) => `Rs ${Math.round(value)}`;
const byId = (id) => document.getElementById(id);

function categories() {
  return Array.from(new Set(menu.map((item) => item.category)));
}

function discountFor(category) {
  return Math.min(Math.max(Number(categoryDiscounts[category] || 0), 0), 90);
}

function priceFor(item, rawPrice = item.price) {
  if (item.category === "Offer") return rawPrice;
  return Math.round(rawPrice * (1 - discountFor(item.category) / 100));
}

function pizzaPrice(item, size) {
  return priceFor(item, size === "Small" ? Math.round(item.price * 0.7) : item.price);
}

function cartCountFor(itemId) {
  return Object.values(cart).filter((line) => line.itemId === itemId).reduce((sum, line) => sum + line.qty, 0);
}

function renderCategories() {
  if (!categories().includes(activeCategory)) activeCategory = categories()[0];
  byId("categoryChips").innerHTML = categories().map((cat) => (
    `<button class="chip ${cat === activeCategory ? "active" : ""}" data-category="${cat}">${cat}</button>`
  )).join("");
}

function renderMenu() {
  const query = byId("searchInput").value.trim().toLowerCase();
  const filtered = menu.filter((item) => {
    const categoryMatch = item.category === activeCategory;
    const searchMatch = !query || `${item.name} ${item.category} ${item.desc}`.toLowerCase().includes(query);
    return categoryMatch && searchMatch;
  });

  byId("menuGrid").innerHTML = filtered.map((item) => `
    <article class="item-card ${cartCountFor(item.id) ? "selected" : ""}">
      <div>
        <div class="item-title">${item.name}</div>
        <div class="item-meta">${item.category} - ${item.desc}</div>
        ${cartCountFor(item.id) ? `<div class="selected-badge">Selected ${cartCountFor(item.id)}</div>` : ""}
      </div>
      ${item.category === "Pizza" ? `
        <div class="size-options">
          <button class="size-btn" data-add="${item.id}" data-size="Small">Small ${rupee(pizzaPrice(item, "Small"))}</button>
          <button class="size-btn" data-add="${item.id}" data-size="Medium">Medium ${rupee(pizzaPrice(item, "Medium"))}</button>
        </div>
      ` : item.category === "Offer" ? shakeOfferHtml() : `
        <div class="item-foot">
          <span class="price">${rupee(priceFor(item))}${discountFor(item.category) ? ` <small>${discountFor(item.category)}% off</small>` : ""}</span>
          <button class="add-btn" data-add="${item.id}">${cartCountFor(item.id) ? "Add more" : "Add"}</button>
        </div>
      `}
    </article>
  `).join("") || `<p>No menu items found.</p>`;
}

function cartLines() {
  return Object.values(cart);
}

function shakeOfferHtml() {
  const shakes = menu.filter((item) => item.category === "Shakes");
  const first = shakes[0];
  const price = first ? Math.round(first.price * 3 * 0.85) : 0;
  return `
    <div class="offer-picker">
      <select data-offer-select="shake-offer">
        ${shakes.map((shake) => `<option value="${shake.id}">${shake.name} x 3 - ${rupee(Math.round(shake.price * 3 * 0.85))}</option>`).join("")}
      </select>
      <div class="item-foot">
        <span class="price" data-offer-price>${rupee(price)}</span>
        <button class="add-btn" data-add-offer="shake-offer">Add offer</button>
      </div>
    </div>
  `;
}

function totals() {
  const subtotal = cartLines().reduce((sum, item) => sum + item.price * item.qty, 0);
  const packaging = subtotal > 0 ? PACKAGING_CHARGE : 0;
  const total = subtotal + packaging;
  return { subtotal, packaging, total };
}

function renderCart() {
  const lines = cartLines();
  byId("cartItems").innerHTML = lines.map((item) => `
    <div class="cart-row">
      <div><strong>${item.name}</strong><br><small>${item.category} - ${rupee(item.price)} each</small></div>
      <div class="qty">
        <button data-dec="${item.key}" type="button">-</button>
        <strong>${item.qty}</strong>
        <button data-inc="${item.key}" type="button">+</button>
      </div>
      <strong>${rupee(item.price * item.qty)}</strong>
    </div>
  `).join("") || `<p class="hint">Add items from the menu to prepare the bill.</p>`;

  const bill = totals();
  byId("subtotalText").textContent = rupee(bill.subtotal);
  byId("packagingText").textContent = rupee(bill.packaging);
  byId("totalText").textContent = rupee(bill.total);
}

function addToCart(id, options = {}) {
  const item = menu.find((entry) => entry.id === id);
  if (!item) return;
  const size = options.size || "";
  const key = options.key || `${id}${size ? `-${size.toLowerCase()}` : ""}`;
  const price = options.price ?? (item.category === "Pizza" ? pizzaPrice(item, size || "Medium") : priceFor(item));
  const name = options.name || (item.category === "Pizza" ? `${item.name} (${size || "Medium"} Size)` : item.name);
  cart[key] = cart[key] || { key, itemId: id, name, category: item.category, price, qty: 0 };
  cart[key].qty += options.qty || 1;
  renderMenu();
  renderCart();
}

function addShakeOffer(shakeId) {
  const shake = menu.find((item) => item.id === shakeId);
  if (!shake) return;
  addToCart("shake-offer", {
    key: `shake-offer-${shake.id}`,
    name: `15% OFF ${shake.name} x 3`,
    price: Math.round(shake.price * 3 * 0.85),
    qty: 1
  });
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
    <h2>Star Feast Cafe</h2>
    <p><strong>Takeaway bill</strong><br>Order: ${order.id}<br>${new Date(order.createdAt).toLocaleString()}</p>
    <p>Customer: ${order.customerName}<br>Mobile: ${order.customerPhone}<br>Payment: ${order.paymentMode}</p>
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
  const items = order.items.map((item) => `- ${item.name} x ${item.qty} = ${rupee(item.price * item.qty)}`).join("\n");
  return [
    `SFC TAKEAWAY ORDER`,
    `Order: ${order.id}`,
    `Name: ${order.customerName}`,
    `Phone: ${order.customerPhone}`,
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
    `<a target="_blank" rel="noopener" href="whatsapp://send?phone=${num}&text=${encoded}">Place order here</a>
    <a class="web-fallback" target="_blank" rel="noopener" href="https://web.whatsapp.com/send?phone=${num}&text=${encoded}">Web fallback ${num.slice(-10)}</a>`
  )).join("");
  byId("receiptDialog").showModal();
}

function renderOrders() {
  const orders = JSON.parse(localStorage.getItem("sfc_orders") || "[]");
  byId("ordersTable").innerHTML = `
    <table>
      <thead><tr><th>Select</th><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Time</th></tr></thead>
      <tbody>
        ${orders.map((order) => `
          <tr>
            <td><input type="radio" name="adminOrder" value="${order.id}"></td>
            <td>${order.id}<br><small>${order.type}</small></td>
            <td>${order.customerName}<br><small>${order.customerPhone}</small></td>
            <td>${order.items.map((item) => `${item.name} x ${item.qty}`).join("<br>")}</td>
            <td><strong>${rupee(order.total)}</strong><br><small>${order.paymentMode}</small></td>
            <td>${new Date(order.createdAt).toLocaleString()}</td>
          </tr>
        `).join("") || `<tr><td colspan="6">No orders yet.</td></tr>`}
      </tbody>
    </table>
  `;
}

function renderMenuEditor() {
  byId("menuEditor").value = JSON.stringify(menu, null, 2);
  renderItemEditor();
}

function renderDiscountAdmin() {
  byId("discountCategory").innerHTML = categories().map((cat) => `<option value="${cat}">${cat}</option>`).join("");
  byId("discountList").innerHTML = categories().map((cat) => {
    const discount = discountFor(cat);
    return `<span class="discount-pill">${cat}: ${discount}%</span>`;
  }).join("");
}

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `item-${Date.now()}`;
}

function renderItemEditor(selectedId = byId("itemEditorSelect")?.value || menu[0]?.id || "") {
  byId("itemEditorSelect").innerHTML = [
    `<option value="">Add new item</option>`,
    ...menu.map((item) => `<option value="${item.id}">${item.category} - ${item.name}</option>`)
  ].join("");
  byId("categoryOptions").innerHTML = categories().map((cat) => `<option value="${cat}"></option>`).join("");
  byId("itemEditorSelect").value = selectedId;
  const item = menu.find((entry) => entry.id === selectedId);
  byId("itemNameInput").value = item?.name || "";
  byId("itemCategoryInput").value = item?.category || "";
  byId("itemPriceInput").value = item?.price ?? "";
  byId("itemDescInput").value = item?.desc || "";
}

function persistMenu(selectedId = "") {
  localStorage.setItem("sfc_menu", JSON.stringify(menu));
  localStorage.setItem("sfc_menu_version", MENU_VERSION);
  activeCategory = categories()[0] || "";
  cart = {};
  renderCategories();
  renderDiscountAdmin();
  renderMenuEditor();
  renderItemEditor(selectedId);
  renderMenu();
  renderCart();
}

function saveItemFromAdmin() {
  const selectedId = byId("itemEditorSelect").value;
  const name = byId("itemNameInput").value.trim();
  const category = byId("itemCategoryInput").value.trim();
  const price = Number(byId("itemPriceInput").value);
  const desc = byId("itemDescInput").value.trim();
  if (!name || !category || !Number.isFinite(price)) {
    alert("Item name, category, and valid price are required.");
    return;
  }
  if (selectedId) {
    menu = menu.map((item) => item.id === selectedId ? { ...item, name, category, price, desc } : item);
    persistMenu(selectedId);
  } else {
    let id = slugify(name);
    let count = 2;
    while (menu.some((item) => item.id === id)) {
      id = `${slugify(name)}-${count}`;
      count += 1;
    }
    menu.push({ id, name, category, price, desc });
    persistMenu(id);
  }
  alert("Item saved.");
}

function deleteItemFromAdmin() {
  const selectedId = byId("itemEditorSelect").value;
  if (!selectedId) return;
  if (!confirm("Delete this menu item?")) return;
  menu = menu.filter((item) => item.id !== selectedId);
  persistMenu("");
}

function selectedAdminOrder() {
  const chosen = document.querySelector("input[name='adminOrder']:checked");
  if (!chosen) return null;
  const orders = JSON.parse(localStorage.getItem("sfc_orders") || "[]");
  return orders.find((order) => order.id === chosen.value) || null;
}

function printAdminBill() {
  const order = selectedAdminOrder();
  if (!order) {
    alert("Select an order first.");
    return;
  }
  byId("adminDialog").close();
  byId("receiptContent").innerHTML = receiptHtml(order);
  byId("whatsappButtons").innerHTML = "";
  byId("receiptDialog").showModal();
  setTimeout(() => window.print(), 100);
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
  const rows = [["Order ID", "Date", "Name", "Phone", "Payment", "Items", "Subtotal", "Packaging", "Total", "Notes"]];
  orders.forEach((order) => rows.push([
    order.id,
    new Date(order.createdAt).toLocaleString(),
    order.customerName,
    order.customerPhone,
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
    const offerButton = event.target.closest("[data-add-offer]");
    if (button) addToCart(button.dataset.add, { size: button.dataset.size });
    if (offerButton) {
      const select = offerButton.closest(".offer-picker").querySelector("[data-offer-select]");
      addShakeOffer(select.value);
    }
  });

  byId("menuGrid").addEventListener("change", (event) => {
    const select = event.target.closest("[data-offer-select]");
    if (!select) return;
    const shake = menu.find((item) => item.id === select.value);
    const price = select.closest(".offer-picker").querySelector("[data-offer-price]");
    if (shake && price) price.textContent = rupee(Math.round(shake.price * 3 * 0.85));
  });

  byId("cartItems").addEventListener("click", (event) => {
    const inc = event.target.closest("[data-inc]");
    const dec = event.target.closest("[data-dec]");
    if (inc && cart[inc.dataset.inc]) cart[inc.dataset.inc].qty += 1;
    if (dec) {
      if (cart[dec.dataset.dec]) cart[dec.dataset.dec].qty = Math.max(cart[dec.dataset.dec].qty - 1, 0);
      if (cart[dec.dataset.dec] && !cart[dec.dataset.dec].qty) delete cart[dec.dataset.dec];
    }
    renderMenu();
    renderCart();
  });

  byId("searchInput").addEventListener("input", renderMenu);
  byId("clearCartBtn").addEventListener("click", () => { cart = {}; renderMenu(); renderCart(); });
  byId("checkoutForm").addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      const order = makeOrder();
      saveOrder(order);
      showReceipt(order);
      cart = {};
      byId("checkoutForm").reset();
      renderMenu();
      renderCart();
    } catch (error) {
      alert(error.message);
    }
  });

  byId("closeReceiptBtn").addEventListener("click", () => byId("receiptDialog").close());
  byId("printReceiptBtn").addEventListener("click", () => window.print());
  byId("adminToggle").addEventListener("click", () => {
    if (sessionStorage.getItem("sfc_admin_ok") !== "yes") {
      const password = prompt("Enter admin password");
      if (btoa(password || "") !== ADMIN_PASSWORD_CODE) {
        alert("Wrong password.");
        return;
      }
      sessionStorage.setItem("sfc_admin_ok", "yes");
    }
    renderOrders();
    renderMenuEditor();
    renderDiscountAdmin();
    byId("adminDialog").showModal();
  });
  byId("closeAdminBtn").addEventListener("click", () => byId("adminDialog").close());
  byId("exportCsvBtn").addEventListener("click", exportCsv);
  byId("exportJsonBtn").addEventListener("click", () => downloadFile("sfc-orders.json", localStorage.getItem("sfc_orders") || "[]", "application/json"));
  byId("printSelectedBillBtn").addEventListener("click", printAdminBill);
  byId("itemEditorSelect").addEventListener("change", () => renderItemEditor());
  byId("newItemBtn").addEventListener("click", () => renderItemEditor(""));
  byId("saveItemBtn").addEventListener("click", saveItemFromAdmin);
  byId("deleteItemBtn").addEventListener("click", deleteItemFromAdmin);
  byId("saveDiscountBtn").addEventListener("click", () => {
    const category = byId("discountCategory").value;
    const percent = Math.min(Math.max(Number(byId("discountPercent").value || 0), 0), 90);
    categoryDiscounts[category] = percent;
    localStorage.setItem("sfc_category_discounts", JSON.stringify(categoryDiscounts));
    renderDiscountAdmin();
    renderMenu();
    alert("Discount saved.");
  });
  byId("clearDiscountBtn").addEventListener("click", () => {
    const category = byId("discountCategory").value;
    delete categoryDiscounts[category];
    localStorage.setItem("sfc_category_discounts", JSON.stringify(categoryDiscounts));
    byId("discountPercent").value = "";
    renderDiscountAdmin();
    renderMenu();
  });
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
      persistMenu(menu[0]?.id || "");
      alert("Menu saved on this device.");
    } catch (error) {
      alert(`Menu not saved: ${error.message}`);
    }
  });
  byId("resetMenuBtn").addEventListener("click", () => {
    if (confirm("Reset menu to the sample SFC list on this device?")) {
      menu = DEFAULT_MENU;
      localStorage.removeItem("sfc_menu");
      persistMenu(menu[0]?.id || "");
    }
  });
}

renderCategories();
renderMenu();
renderCart();
bindEvents();
