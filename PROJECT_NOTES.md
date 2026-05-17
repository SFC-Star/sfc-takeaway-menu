# SFC Takeaway App Notes

Live site: https://sfc-star.github.io/sfc-takeaway-menu/

Repo: https://github.com/SFC-Star/sfc-takeaway-menu

Purpose: free static QR ordering page for Star Feast Cafe takeaway orders.

Current behavior:
- Pure veg menu loaded from `app.js` `DEFAULT_MENU`.
- Pizza items have Small and Medium size buttons. Small is 30% less than Medium/current menu price.
- Combo pizza names include `(Medium Size)`.
- Offer category lets customer choose one shake; it adds 3 quantity with 15% discount.
- Admin panel asks for password before opening.
- Admin can save category discounts, export order data, and print a selected saved bill.
- No pickup time.
- No advance payment.
- Takeaway only, no home delivery.
- Final bill is generated in the browser.
- Orders save in browser `localStorage` and can export CSV/JSON from Admin.
- Receipt buttons say `Place order here` and try the WhatsApp app first with `whatsapp://send`.
- Web fallback buttons use `https://web.whatsapp.com/send`.
- Kitchen WhatsApp numbers are `8209531318` and `8619973534`.

Common next steps:
- Edit menu/prices in `app.js` `DEFAULT_MENU`.
- Update `MENU_VERSION` if customers should receive a forced local menu refresh.
- Run `node --check app.js`.
- Commit and push `main`, then publish with `git push origin main:gh-pages`.
