const axios = require('axios');
require('dotenv').config();

class NvidiaClient {
  constructor() {
    this.apiKey = process.env.NVIDIA_API_KEY;
    this.baseUrl = 'https://api.nvidia.com/v1'; // Placeholder for actual NIM base URL
  }

  async queryRAG(query, context) {
    if (!this.apiKey) {
      console.warn('[NVIDIA] API Key missing, using fallback simulated RAG logic');
      return this._simulateRAG(query, context);
    }

    try {
      // Implementation for NVIDIA NIM RAG call
      const response = await axios.post(`${this.baseUrl}/chat/completions`, {
        model: 'nvidia/llama-3.1-70b-instruct',
        messages: [
          { role: 'system', content: 'You are a compliance expert. Use the provided context to cite specific policies.' },
          { role: 'user', content: `Context: ${JSON.stringify(context)}\n\nQuestion: ${query}` }
        ]
      }, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('[NVIDIA] RAG Error:', error.message);
      return this._simulateRAG(query, context);
    }
  }

  async optimizeBudget(expenses) {
    if (!this.apiKey) {
      console.warn('[NVIDIA] API Key missing, using fallback optimization logic');
      return this._simulateOptimization(expenses);
    }

    try {
      // Implementation for cuOpt API call
      const response = await axios.post(`${this.baseUrl}/cuopt/optimize`, {
        data: expenses,
        constraints: { budget_limit: 50000 }
      }, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      return response.data.suggestions;
    } catch (error) {
      console.error('[NVIDIA] Optimization Error:', error.message);
      return this._simulateOptimization(expenses);
    }
  }

  _simulateRAG(query, context) {
    const rule = context.find(r => r.description.toLowerCase().includes(query.toLowerCase())) || context[0];
    return `[CITED POLICY] ${rule.ruleName}: ${rule.description} (Severity: ${rule.severity})`;
  }

  _simulateOptimization(expenses) {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    return `Based on current spending ($${total}), I recommend reducing ${expenses[0].category} costs by 15% to optimize for compliance.`;
  }
}

module.exports = new NvidiaClient();
