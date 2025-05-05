async function listOffers() {
    try {
        const response = await fetch('/api/list-capital-product-offers');
        const data = await response.json();
        
        const offersDiv = document.getElementById('offersList');
        offersDiv.innerHTML = '';
        
        if (data.results && data.results.length > 0) {
            const offersList = document.createElement('div');
            offersList.className = 'offers-grid';
            
            data.results.forEach(offer => {
                const offerElement = document.createElement('div');
                offerElement.className = 'offer-card';
                
                offerElement.innerHTML = `
                    <div class="offer-header">
                        <h3>${offer.product_type.replace(/_/g, ' ').toUpperCase()}</h3>
                        <span class="status-badge ${offer.status.toLowerCase()}">${offer.status}</span>
                    </div>
                    <div class="offer-body">
                        <div class="offer-amount">
                            <span class="label">Max Amount</span>
                            <span class="value">$${Number(offer.max_offer_amount).toLocaleString()}</span>
                        </div>
                        ${offer.product_type === 'term_loan' ? `
                            <div class="term-loan-details">
                                <div class="detail-item">
                                    <span class="label">Schedule</span>
                                    <span class="value">${offer.term_loan_offer_details.schedule}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Fixed Amount</span>
                                    <span class="value">$${Number(offer.term_loan_offer_details.fixed_amount).toLocaleString()}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Term Length</span>
                                    <span class="value">${offer.term_loan_offer_details.term_length_months} months</span>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    <div class="offer-footer">
                        <button onclick="viewOffer('${offer.id}')" class="btn-view-details">View Details</button>
                    </div>
                `;
                
                offersList.appendChild(offerElement);
            });
            
            offersDiv.appendChild(offersList);
        } else {
            offersDiv.innerHTML = '<div class="no-offers"><p>No offers available</p></div>';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('offersList').innerHTML = 
            '<div class="error-message"><p>Error fetching offers</p></div>';
    }
}

async function viewOffer(offerId) {
    try {
        const response = await fetch(`/api/capital-product-offers/${offerId}`);
        const offer = await response.json();
        
        // Create and show modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Offer Details</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="detail-section">
                        <h3>Basic Information</h3>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <span class="label">Offer ID</span>
                                <span class="value">${offer.id}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Product Type</span>
                                <span class="value">${offer.product_type.replace(/_/g, ' ').toUpperCase()}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Status</span>
                                <span class="value status-badge ${offer.status.toLowerCase()}">${offer.status}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Max Amount</span>
                                <span class="value">$${Number(offer.max_offer_amount).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    ${offer.product_type === 'term_loan' ? `
                        <div class="detail-section">
                            <h3>Term Loan Details</h3>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <span class="label">Schedule</span>
                                    <span class="value">${offer.term_loan_offer_details.schedule}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Fixed Amount</span>
                                    <span class="value">$${Number(offer.term_loan_offer_details.fixed_amount).toLocaleString()}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Term Length</span>
                                    <span class="value">${offer.term_loan_offer_details.term_length_months} months</span>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.onclick = () => {
            modal.remove();
        };
        
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching offer details');
    }
}

// Add styles
const style = document.createElement('style');
style.textContent = `
    .offers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        padding: 20px;
    }
    
    .offer-card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        overflow: hidden;
        transition: transform 0.2s;
    }
    
    .offer-card:hover {
        transform: translateY(-2px);
    }
    
    .offer-header {
        padding: 15px;
        background: #f8f9fa;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .offer-header h3 {
        margin: 0;
        font-size: 1.1em;
        color: #333;
    }
    
    .status-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8em;
        font-weight: 500;
    }
    
    .status-badge.active {
        background: #e8f5e9;
        color: #2e7d32;
    }
    
    .status-badge.pending {
        background: #fff3e0;
        color: #ef6c00;
    }
    
    .status-badge.closed {
        background: #ffebee;
        color: #c62828;
    }
    
    .offer-body {
        padding: 15px;
    }
    
    .offer-amount {
        margin-bottom: 15px;
    }
    
    .detail-item {
        margin-bottom: 10px;
    }
    
    .label {
        display: block;
        font-size: 0.9em;
        color: #666;
        margin-bottom: 4px;
    }
    
    .value {
        font-weight: 500;
        color: #333;
    }
    
    .offer-footer {
        padding: 15px;
        border-top: 1px solid #eee;
        text-align: right;
    }
    
    .btn-view-details {
        background: #007bff;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    
    .btn-view-details:hover {
        background: #0056b3;
    }
    
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .modal-content {
        background: white;
        border-radius: 8px;
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .modal-header {
        padding: 15px 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .modal-header h2 {
        margin: 0;
        font-size: 1.5em;
    }
    
    .close-modal {
        background: none;
        border: none;
        font-size: 1.5em;
        cursor: pointer;
        color: #666;
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .detail-section {
        margin-bottom: 20px;
    }
    
    .detail-section h3 {
        margin: 0 0 15px 0;
        color: #333;
    }
    
    .detail-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
    }
    
    .no-offers, .error-message {
        text-align: center;
        padding: 40px;
        color: #666;
    }
    
    .error-message {
        color: #c62828;
    }
`;

document.head.appendChild(style); 