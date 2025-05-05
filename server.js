const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

// Parafin API configuration
const PARAFIN_API_URL = process.env.PARAFIN_API_URL;
const CLIENT_ID = process.env.PARAFIN_CLIENT_ID;
const CLIENT_SECRET = process.env.PARAFIN_CLIENT_SECRET;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create a business
app.post('/api/create-business', async (req, res) => {
    try {
        const response = await axios.post(`${PARAFIN_API_URL}/businesses`, req.body, {
            auth: {
                username: CLIENT_ID,
                password: CLIENT_SECRET
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
});

// Get businesses
app.get('/api/businesses', async (req, res) => {
    try {
        const response = await axios.get(`${PARAFIN_API_URL}/businesses`, {
            auth: {
                username: CLIENT_ID,
                password: CLIENT_SECRET
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
});

// Create a capital product offer
async function createOffer(business_external_id) {
    try {
        const response = await axios.post(`${PARAFIN_API_URL}/sandbox/generate_event/capital_product_offer/created`, {
            capital_product_offer: {
                max_offer_amount: "30000",
                product_type: "flex_loan",
                include_fee_discount: false
            },
            person: {
                address: {
                    city: "San Francisco",
                    country: "US",
                    state: "CA",
                    postal_code: "94105",
                    line1: "301 Howard St"
                },
                contact_email: "e.leroy@cornergas.com",
                contact_phone: "6502228888",
                first_name: "Oscar",
                last_name: "Leroy"
            },
            business: {
                address: {
                    city: "San Francisco",
                    country: "US",
                    state: "CA",
                    postal_code: "94105",
                    line1: "301 Howard St"
                },
                business_external_id: business_external_id,
                dba_name: "cornergas",
                established_date: "2022-10-10",
                incorporation_state: "CA",
                incorporation_type: "corporation",
                legal_name: "Corner Gas Inc",
                mcc: "5541"
            },
            bank_account: {
                account_number: {
                    last4: "5678"
                },
                routing_number: "021000021",
                currency: "USD",
                is_verified: true
            }
        }, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating offer:', error.response?.data || error.message);
        throw error;
    }
}

// Close a capital product offer
async function closeOffer(business_external_id) {
    try {
        const response = await axios.post(`${PARAFIN_API_URL}/sandbox/generate_event/capital_product_offer/closed`, {
            business_external_id: business_external_id
        }, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error closing offer:', error.response?.data || error.message);
        throw error;
    }
}

// API Endpoints
app.post('/api/create-offer', async (req, res) => {
    try {
        const { business_external_id } = req.body;
        const response = await axios.post(`${PARAFIN_API_URL}/sandbox/generate_event/capital_product_offer/created`, {
            capital_product_offer: {
                max_offer_amount: "30000",
                product_type: "merchant_cash_advance",
                include_fee_discount: false
            },
            person: {
                address: {
                    city: "San Francisco",
                    country: "US",
                    state: "CA",
                    postal_code: "94105",
                    line1: "301 Howard St"
                },
                contact_email: "e.leroy@cornergas.com",
                contact_phone: "6502228888",
                first_name: "Oscar",
                last_name: "Leroy"
            },
            business: {
                address: {
                    city: "San Francisco",
                    country: "US",
                    state: "CA",
                    postal_code: "94105",
                    line1: "301 Howard St"
                },
                business_external_id: business_external_id,
                dba_name: "cornergas",
                established_date: "2022-10-10",
                incorporation_state: "CA",
                incorporation_type: "corporation",
                legal_name: "Corner Gas Inc",
                mcc: "5541"
            },
            bank_account: {
                account_number: {
                    last4: "5678"
                },
                routing_number: "021000021",
                currency: "USD",
                is_verified: true
            }
        }, {
            auth: {
                username: CLIENT_ID,
                password: CLIENT_SECRET
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
});

app.post('/api/close-offer', async (req, res) => {
    try {
        const { business_external_id } = req.body;
        const response = await axios.post(`${PARAFIN_API_URL}/sandbox/generate_event/capital_product_offer/closed`, {
            business_external_id: business_external_id
        }, {
            auth: {
                username: CLIENT_ID,
                password: CLIENT_SECRET
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 