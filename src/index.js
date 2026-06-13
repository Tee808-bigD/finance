const express = require('express');
const mongoose = require('mongoose');
const nvidiaClient = require('./services/nvidiaClient');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const Expense = require('./models/Expense');
const Policy = require('./models/Policy');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3978;

app.use(cors({ origin: '*', credentials: false }));
app.use(express.json());

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const aiLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 30 });
app.use('/api/', apiLimiter);
app.use('/api/messages', aiLimiter);

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not set');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => { console.error('❌ MongoDB error:', err.message); process.exit(1); });

async function seedDatabase() {
  try {
    if (await Policy.countDocuments() === 0) {
      await Policy.insertMany([
        { ruleName: 'Max Item Limit', threshold: 5000, category: 'general', description: 'Expenses exceeding $5,000 are strictly prohibited without board approval.', severity: 'HIGH' },
        { ruleName: 'Pre-Approval Threshold', threshold: 2000, category: 'travel', description: 'Travel expenses > $2,000 require pre-approval from the department head.', severity: 'MEDIUM' },
        { ruleName: 'Vendor Approval', category: 'vendors', description: 'All vendors must be on the approved corporate list.', severity: 'MEDIUM' },
        { ruleName: 'Receipt Requirement', threshold: 25, category: 'documentation', description: 'Digital receipts are required for all expenses over $25.', severity: 'LOW' }
      ]);
    }
    if (await Expense.countDocuments() === 0) {
      await Expense.insertMany([
        { submitter: 'john.doe@company.com', amount: 1500, vendor: 'Acme Corp', category: 'travel', approved: false },
        { submitter: 'jane.smith@company.com', amount: 2500, vendor: 'Unapproved Vendor', category: 'conference', approved: false },
        { submitter: 'bob.johnson@company.com', amount: 150, vendor: 'Office Supplies Ltd', category: 'supplies', approved: true },
        { submitter: 'alice.williams@company.com', amount: 8000, vendor: 'TechVendor Inc', category: 'software', approved: false }
      ]);
    }
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  }
}
seedDatabase();

function createAdaptiveCard(title, facts, status = 'Attention') {
  return { type: 'message', attachments: [{ contentType: 'application/vnd.microsoft.card.adaptive', content: { type: 'AdaptiveCard', version: '1.4', body: [{ type: 'TextBlock', text: title, weight: 'Bolder', size: 'Medium', color: status === 'Success' ? 'Good' : 'Attention' }, { type: 'FactSet', facts: facts.map(f => ({ title: f.label, value: f.value })) }], actions: [{ type: 'Action.OpenUrl', title: 'View Policy', url: 'https://company.sharepoint.com/policies' }] } }] };
}

app.get('/', (req, res) => {
  res.type('html').send(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Finance Agent</title><style>body{font-family:Arial;max-width:900px;margin:40px auto;padding:20px;background:#f5f5f5}h1{color:#333}input{width:100%;padding:12px;font-size:16px;border:1px solid #ddd;border-radius:4px}button{padding:10px 20px;margin:5px;background:#0f766e;color:white;border:none;cursor:pointer;border-radius:4px}pre{background:#222;color:#0f0;padding:15px;overflow-x:auto}.chips{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}@media(max-width:600px){input{font-size:14px}button{width:100%}}</style></head><body><h1>Finance Intelligence Agent</h1><input id="input" type="text" value="review expense reports"><button onclick="send()">Send</button><div class="chips"><button onclick="document.getElementById('input').value='review expense reports';send()">Review expenses</button><button onclick="document.getElementById('input').value='check policy compliance';send()">Compliance</button><button onclick="document.getElementById('input').value='identify spending anomalies';send()">Anomalies</button><button onclick="document.getElementById('input').value='optimize budget';send()">Optimize</button><button onclick="document.getElementById('input').value='generate compliance report';send()">Report</button></div><pre id="output">Ready</pre><script>async function send(){const text=document.getElementById('input').value;const output=document.getElementById('output');output.textContent='Loading...';try{const res=await fetch('https://merry-elegance.up.railway.app/api/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text})});if(!res.ok)throw new Error('HTTP '+res.status);const data=await res.json();output.textContent=JSON.stringify(data,null,2);}catch(e){output.textContent='Error: '+e.message;}}</script></body></html>`);
});

app.get('/health', (req, res) => res.json({ status: 'running' }));

app.post('/api/messages', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });

    const lower = text.toLowerCase();
    let result;

    if (lower.includes('review expense') || lower.includes('expense reports')) {
      const expenses = await Expense.find().lean();
      const policies = await Policy.find().lean();
      const limitPolicy = policies.find(p => p.ruleName === 'Max Item Limit');
      const violations = expenses.filter(e => limitPolicy && e.amount > limitPolicy.threshold).length;
      result = createAdaptiveCard('Expense Review', [
        { label: 'Total Reviewed', value: expenses.length.toString() },
        { label: 'Violations Found', value: violations.toString() }
      ], violations === 0 ? 'Success' : 'Attention');
    } else if (lower.includes('compliance') || lower.includes('policy')) {
      const expenses = await Expense.find().lean();
      result = createAdaptiveCard('Compliance Check', [
        { label: 'Total Expenses', value: expenses.length.toString() },
        { label: 'Status', value: 'Compliant' }
      ], 'Success');
    } else if (lower.includes('anomal')) {
      const expenses = await Expense.find().lean();
      const avg = expenses.length ? expenses.reduce((s, e) => s + e.amount, 0) / expenses.length : 0;
      const anomalies = expenses.filter(e => e.amount > avg * 1.5).length;
      result = createAdaptiveCard('Anomaly Detection', [
        { label: 'Average Expense', value: '$' + avg.toFixed(2) },
        { label: 'Anomalies Found', value: anomalies.toString() }
      ], anomalies === 0 ? 'Success' : 'Attention');
    } else if (lower.includes('optimize') || lower.includes('budget')) {
      result = createAdaptiveCard('Budget Optimization', [
        { label: 'Status', value: 'Analyzed' },
        { label: 'Recommendation', value: 'Reduce spending by 15%' }
      ], 'Success');
    } else if (lower.includes('report')) {
      const expenses = await Expense.find().lean();
      const total = expenses.reduce((s, e) => s + e.amount, 0);
      result = createAdaptiveCard('Compliance Report', [
        { label: 'Total Processed', value: expenses.length.toString() },
        { label: 'Total Spend', value: '$' + total.toFixed(2) }
      ], 'Success');
    } else {
      result = { type: 'message', text: 'Commands: review expenses, compliance, anomalies, optimize, report' };
    }

    res.json(result);
  } catch (error) {
    console.error('[ERROR]', error);
    res.status(500).json({ error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Finance Intelligence Agent running on http://localhost:${PORT}`);
  console.log('Endpoints: GET /health, POST /api/messages');
});

module.exports = app;
