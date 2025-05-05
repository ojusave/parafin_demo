# Parafin API Demo

A demo application showcasing the integration with Parafin's API for managing capital product offers.

## Features

- Create and manage capital product offers
- View offer details and status


## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Parafin API credentials

## Setup

1. Clone the repository:
```bash
git clone hhttps://github.com/ojusave/parafin_demo.git
cd parafin-demo
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Parafin API credentials:
```
PARAFIN_API_URL=https://api.parafin.com/v1
PARAFIN_CLIENT_ID=your_client_id
PARAFIN_CLIENT_SECRET=your_client_secret
```

## Running the Application

Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Application Flow

1. **Initial View**
   - The main page shows two buttons: "No Offer" and "Create Offer"
   - The right side of the screen shows API request/response display areas
   - Below the buttons is an iframe area (initially hidden)

2. **No Offer Button**
   - Clicking "No Offer" triggers:
     - `POST /api/close-offer`
     - This calls Parafin's `POST /v1/sandbox/generate_event/capital_product_offer/closed`
   - The system will:
     - Close the current offer
     - Display the API request and response in the right panel
     - Hide the offer iframe if it was visible

3. **Create Offer Button**
   - Clicking "Create Offer" triggers:
     - `POST /api/create-offer`
     - This calls Parafin's `POST /v1/sandbox/generate_event/capital_product_offer/created`
   - The system will automatically:
     - Generate a new business ID
     - Create a capital product offer
     - Display the API request and response in the right panel
   - If an offer URL is generated, it will appear in the iframe below the buttons

4. **Monitoring API Interactions**
   - All API calls are displayed in real-time on the right side
   - The request section shows:
     - The complete API URL
     - Request headers
     - Request body
   - The response section shows:
     - The complete API response
     - Any error messages if the call fails


