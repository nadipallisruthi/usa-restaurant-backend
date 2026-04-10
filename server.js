const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let orders = [];

// EMAIL SETUP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yourgmail@gmail.com',
    pass: 'your_app_password'
  }
});

// ORDER API
app.post('/order', (req, res) => {
  const order = req.body;
  orders.push(order);

  const fileName = `order_${Date.now()}.pdf`;

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(fileName));

  doc.fontSize(18).text('USA Restaurant Catering Order');
  doc.moveDown();

  Object.keys(order).forEach(key => {
    doc.text(`${key}: ${order[key]}`);
  });

  doc.end();

  // SEND EMAIL
  setTimeout(() => {
    transporter.sendMail({
      from: 'yourgmail@gmail.com',
      to: 'nadipallisruthi@gmail.com',
      subject: 'New Catering Order',
      text: 'Order attached',
      attachments: [{ filename: fileName, path: fileName }]
    });
  }, 2000);

  res.json({ message: 'Order placed successfully' });
});

// ADMIN ORDERS
app.get('/orders', (req, res) => {
  res.json(orders);
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});