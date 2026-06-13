markdown
# Finance Intelligence Agent 🚀

An AI-powered finance and compliance agent that automates expense review, policy compliance checking, anomaly detection, and budget optimization.

## 🌐 Live Demo

- **Frontend UI**: [https://tee808-bigd.github.io/finance/](https://tee808-bigd.github.io/finance/)
- **Backend API**: [https://merry-elegance-production-0335.up.railway.app](https://merry-elegance-production-0335.up.railway.app)
- **Health Check**: [https://merry-elegance-production-0335.up.railway.app/health](https://merry-elegance-production-0335.up.railway.app/health)

## ✨ Features

- **Expense Review** - Automatically review expense reports against company policies
- **Compliance Checking** - Ensure all expenses follow established rules and thresholds
- **Anomaly Detection** - Identify unusual spending patterns and high-risk transactions
- **Budget Optimization** - Get AI-powered recommendations for budget allocation
- **Real-time Alerts** - WebSocket notifications for policy violations
- **Admin Dashboard** - Secure endpoints for expense and policy management

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **AI Integration**: NVIDIA AI API (cuOpt for optimization)
- **Real-time**: Socket.IO
- **Security**: CORS, Rate Limiting, API Key Authentication

### Frontend
- **Hosting**: GitHub Pages
- **Technologies**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Responsive design with CSS Grid/Flexbox

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- NVIDIA API key (for AI features)
- Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Tee808-bigD/finance.git
cd finance
2. Install dependencies
bash
npm install
3. Set up environment variables
Create a .env file in the root directory (use .env.example as template):

env
PORT=3978
MONGODB_URI=your_mongodb_connection_string
NVIDIA_API_KEY=your_nvidia_api_key
ADMIN_API_KEY=your_secure_admin_key
NODE_ENV=development
4. Start the backend server
bash
node src/index.js
The server will run at http://localhost:3978

5. Open the frontend
Open index.html in your browser or serve it locally:

bash
npx serve .
📡 API Endpoints
Public Endpoints
Method	Endpoint	Description
GET	/	Frontend UI
GET	/health	Health check
POST	/api/messages	Send commands to AI agent
Admin Endpoints (require x-api-key header)
Method	Endpoint	Description
GET	/api/expenses	List all expenses
POST	/api/expenses	Add new expense
GET	/api/policies	List compliance policies
GET	/api/analytics	Get spending analytics
💬 Available Commands
Send these commands to the /api/messages endpoint:

review expense reports - Review all expenses against policies

check policy compliance - Generate compliance status report

identify spending anomalies - Detect unusual transactions

optimize budget - Get AI-powered budget recommendations

generate compliance report - Create audit-ready report

🔒 Security Features
API Key Authentication for admin endpoints

Rate Limiting (100 requests/15 min for API, 30 requests/hour for AI endpoints)

CORS Configuration for secure cross-origin requests

Environment Variable Management for sensitive data

Input Validation and sanitization

📊 Database Schema
Expense Model
javascript
{
  submitter: String,    // Email of person who submitted
  amount: Number,       // Expense amount in USD
  vendor: String,       // Vendor name
  category: String,     // travel, supplies, software, etc.
  approved: Boolean     // Approval status
}
Policy Model
javascript
{
  ruleName: String,     // Name of the policy rule
  threshold: Number,    // Monetary threshold (if applicable)
  category: String,     // general, travel, vendors, documentation
  description: String,  // Policy description
  severity: String      // HIGH, MEDIUM, LOW
}
🚢 Deployment
Backend (Railway)
Push code to GitHub

Connect repository to Railway

Add environment variables in Railway dashboard

Deploy automatically

Frontend (GitHub Pages)
Go to repository Settings → Pages

Set source to main branch

Site will be available at https://tee808-bigd.github.io/finance/

🧪 Testing
Test the API with curl:

bash
# Health check
curl https://merry-elegance-production-0335.up.railway.app/health

# Send command
curl -X POST https://merry-elegance-production-0335.up.railway.app/api/messages \
  -H "Content-Type: application/json" \
  -d '{"text":"review expense reports"}'
📁 Project Structure
text
finance/
├── src/
│   ├── index.js           # Main application entry point
│   ├── models/
│   │   ├── Expense.js     # Expense database model
│   │   └── Policy.js      # Policy database model
│   └── services/
│       └── nvidiaClient.js # NVIDIA AI API integration
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── index.html            # Frontend UI
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
🤝 Contributing
Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
This project is private and owned by Tee808-bigD.

👤 Author
Tee808-bigD

GitHub: @Tee808-bigD

🙏 Acknowledgments
NVIDIA AI for cuOpt optimization capabilities

MongoDB Atlas for database hosting

Railway for backend deployment

GitHub Pages for frontend hosting

🚨 Troubleshooting
Common Issues
CORS errors: Ensure frontend is calling the correct backend URL
MongoDB connection: Verify MONGODB_URI is correct in environment variables
Rate limiting: Wait 15 minutes if you hit the 100 request limit
Authentication errors: Include x-api-key header for admin endpoints

Getting Help
Check the GitHub Issues

Review Railway deployment logs

Test endpoints with the /health endpoint first

Built with ❤️ for finance automation and compliance

text

## How to Add This README

1. **Create the README file**:
   - Go to your GitHub repository
   - Click "Add file" → "Create new file"
   - Name it `README.md`
   - Copy and paste the template above
   - Click "Commit new file"

2. **Customize as needed**:
   - Update any URLs if they change
   - Add screenshots of your UI
   - Include specific setup instructions for your team

3. **Preview**:
   - GitHub will automatically render the markdown
   - The README appears on your repository's main page

## Optional Additions

You might also want to add:

- **Screenshots folder** (`/screenshots`) with UI images
- **License file** (if making open source)
- **Contributing guide** (`CONTRIBUTING.md`)
- **Code of conduct** (`CODE_OF_CONDUCT.md`)

Would you like me to help you customize any section of the README?
