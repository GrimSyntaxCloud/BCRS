const { randomUUID } = require('node:crypto');
const products = [
  { id: 100, title: 'Password Reset', price: 39.99, laborHours: 1 },
  { id: 101, title: 'Spyware Removal', price: 99.99, laborHours: 2 },
  { id: 102, title: 'RAM Upgrade', price: 129.99, laborHours: 2 },
  { id: 103, title: 'Software Installation', price: 49.99, laborHours: 1 },
  { id: 104, title: 'PC Tune-up', price: 89.99, laborHours: 2 },
  { id: 105, title: 'Keyboard Cleaning', price: 45, laborHours: 1 },
  { id: 106, title: 'Disk Clean-up', price: 149.99, laborHours: 2 },
];
const users = [
  { _id: '000000000000000000000001', userName: 'demo', firstName: 'Demo', lastName: 'Administrator', email: 'demo@example.com', phoneNumber: '(202) 555-0100', address: 'Fictional demo address', role: { text: 'admin' }, isDisabled: false },
  { _id: '000000000000000000000002', userName: 'sample-customer', firstName: 'Sample', lastName: 'Customer', email: 'customer@example.com', phoneNumber: '(202) 555-0101', address: 'Fictional demo address', role: { text: 'standard' }, isDisabled: false },
];
const roles = [
  { _id: '000000000000000000000011', text: 'admin', isDisabled: false },
  { _id: '000000000000000000000012', text: 'standard', isDisabled: false },
];
const questions = [
  { _id: '000000000000000000000021', text: 'Example question: What is the demo robot called?', isDisabled: false },
  { _id: '000000000000000000000022', text: 'Example question: What is the fictional shop mascot?', isDisabled: false },
];
const money = n => Math.round((n + Number.EPSILON) * 100) / 100;
function bad(message) {
  const error = new Error(message);
  error.status = 400;
  throw error;
}
function amount(value, max) {
  if (value === undefined) return 0;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > max) bad('Invalid sample invoice adjustment.');
  return money(value);
}
function invoiceFrom(body) {
  if (!Array.isArray(body?.lineItems) || body.lineItems.length < 1 || body.lineItems.length > 14) bad('Choose between 1 and 14 sample services.');
  const lineItems = body.lineItems.map(item => {
    const product = products.find(p => p.id === item?.id);
    if (!product) bad('Unknown repair service.');
    return { ...product };
  });
  const adjustedParts = amount(body.adjustedParts, 5000);
  const adjustedLabor = amount(body.adjustedLabor, 2000);
  const lineItemTotal = money(lineItems.reduce((sum, item) => sum + item.price, 0));
  const laborAmount = lineItems.reduce((sum, item) => sum + item.laborHours * 50, 0);
  return { _id: randomUUID(), userName: 'demo', lineItems, lineItemTotal,
    laborAmount, adjustedParts, adjustedLabor,
    total: money(lineItemTotal + laborAmount + adjustedParts + adjustedLabor),
    orderDate: new Date().toISOString() };
}
function seedInvoices() {
  return [invoiceFrom({ lineItems: [{ id: 100 }, { id: 105 }] }),
    invoiceFrom({ lineItems: [{ id: 102 }] })].map((invoice, index) => ({ ...invoice, _id: `00000000-0000-4000-8000-00000000000${index + 1}`, isDemo: true }));
}
function purchases(invoices) {
  const groups = new Map();
  for (const invoice of invoices) for (const item of invoice.lineItems) {
    const entry = groups.get(item.id) || { _id: { title: item.title, price: item.price }, count: 0 };
    entry.count++;
    groups.set(item.id, entry);
  }
  return [...groups.values()].sort((a, b) => a._id.title.localeCompare(b._id.title));
}
module.exports = { users, roles, questions, invoiceFrom, seedInvoices, purchases };
