let total = 0;

// Add new item row
document.getElementById('addItemBtn').addEventListener('click', () => {
  const container = document.getElementById('itemsContainer');

  const div = document.createElement('div');
  div.classList.add('item-row');
  div.innerHTML = `
    <input type="text" placeholder="Item Name" class="item-name" required>
    <input type="number" placeholder="Item Price" class="item-price" min="0" required>
    <button type="button" class="removeItemBtn">Remove</button>
  `;

  container.appendChild(div);
  addPriceListener(div);
});

// Add event listeners to inputs and remove buttons
function addPriceListener(div) {
  const priceInput = div.querySelector('.item-price');
  priceInput.addEventListener('input', calculateTotal);

  div.querySelector('.removeItemBtn').addEventListener('click', () => {
    div.remove();
    calculateTotal();
  });
}

// Calculate total from all item prices
function calculateTotal() {
  const prices = document.querySelectorAll('.item-price');
  total = 0;
  prices.forEach(p => {
    const val = parseFloat(p.value);
    if (!isNaN(val)) total += val;
  });
  document.getElementById('totalAmount').textContent = total.toFixed(2);
}

// Form submit — generate invoice preview
document.getElementById('invoiceForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const yourName = document.getElementById('yourName').value;
  const yourAddress = document.getElementById('yourAddress').value;
  const yourEmail = document.getElementById('yourEmail').value;
  const yourPhone = document.getElementById('yourPhone').value;

  const clientName = document.getElementById('clientName').value;
  const clientAddress = document.getElementById('clientAddress').value;
  const clientEmail = document.getElementById('clientEmail').value;
  const clientPhone = document.getElementById('clientPhone').value;

  const invoiceNumber = document.getElementById('invoiceNumber').value;
  const invoiceDate = document.getElementById('invoiceDate').value;

  const items = document.querySelectorAll('.item-row');
  let itemList = '';
  items.forEach((row, i) => {
    const name = row.querySelector('.item-name').value;
    const price = parseFloat(row.querySelector('.item-price').value).toFixed(2);
    itemList += `<tr><td>${i + 1}</td><td>${name}</td><td>$${price}</td></tr>`;
  });

  const invoiceHTML = `
    <div id="invoicePDF" style="font-family:Arial; padding:20px; font-size:14px;">
      <h2>Invoice</h2>
      <p><strong>From:</strong><br>${yourName}<br>${yourAddress}<br>
        ${yourEmail ? "Email: " + yourEmail + "<br>" : ""}
        ${yourPhone ? "Phone: " + yourPhone : ""}
      </p>
      <p><strong>To:</strong><br>${clientName}<br>${clientAddress}<br>
        ${clientEmail ? "Email: " + clientEmail + "<br>" : ""}
        ${clientPhone ? "Phone: " + clientPhone : ""}
      </p>
      <p><strong>Invoice #:</strong> ${invoiceNumber}<br>
         <strong>Date:</strong> ${invoiceDate}
      </p>

      <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse: collapse; margin-top:20px;">
        <thead>
          <tr><th>#</th><th>Item</th><th>Price</th></tr>
        </thead>
        <tbody>
          ${itemList}
        </tbody>
      </table>

      <h3 style="text-align:right; margin-top:20px;">Total: $${total.toFixed(2)}</h3>
      <p style="margin-top:40px;">Thank you for your business!</p>
    </div>
  `;

  // Show on screen
  const output = document.getElementById('invoiceOutput');
  output.innerHTML = invoiceHTML;
  output.style.display = 'block';

  // Show download button
  document.getElementById('downloadPDF').style.display = 'inline-block';
});

// Save invoice as PDF, fit to 1 page
document.getElementById('downloadPDF').addEventListener('click', () => {
  const invoiceNumber = document.getElementById('invoiceNumber').value.trim() || "invoice";
  const element = document.getElementById('invoiceOutput');

  setTimeout(() => {
    const opt = {
      margin:       0.2,
      filename:     `${invoiceNumber}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  {
        scale: 1.2,
        scrollY: 0
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: {
        mode: ['avoid']
      }
    };

    html2pdf().set(opt).from(element).save();
  }, 200); // Wait briefly to ensure rendering complete
});
