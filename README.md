# SFC Takeaway QR Ordering

Free static ordering page for SFC Cloud Kitchen.

## What it does

- Customers scan a QR and place takeaway-only orders.
- The live menu is pure veg and based on `Copy of SFC Menu.pdf`.
- 40% advance payment is shown on the cart, receipt, WhatsApp message, and CSV export.
- The app generates a printable final bill.
- The receipt can be sent to both WhatsApp numbers:
  - 8209531318
  - 8619973534
- Orders are stored on the device browser and can be exported as CSV or JSON from Admin.
- A QR code can be generated from the Admin panel after the page is published.

## Important free WhatsApp note

Free WhatsApp links cannot auto-send messages in the background. The app opens pre-filled WhatsApp receipts, and the customer or staff taps Send. Fully automatic WhatsApp delivery needs the paid/approved WhatsApp Business Cloud API.

## Publish free

Use any free static host such as GitHub Pages, Netlify, Vercel, or Cloudflare Pages. After publishing, open Admin, paste the public link, and generate the QR.

## Menu editing

Open Admin and edit the Menu data JSON. Save menu stores the edited items in that browser. For a permanent default menu, replace `DEFAULT_MENU` in `app.js`.
