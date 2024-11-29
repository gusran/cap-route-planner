// src/components/LegDetails.js

import React from 'react';

function LegDetails({ legDetails }) {
    return (
        <div id="leg-details" style={{ marginTop: '20px' }}>
            <h2>Leg Details</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    <th style={{ borderBottom: '1px solid #ddd' }}>From</th>
                    <th style={{ borderBottom: '1px solid #ddd' }}>To</th>
                    <th style={{ borderBottom: '1px solid #ddd' }}>Distance (NM)</th>
                    <th style={{ borderBottom: '1px solid #ddd' }}>Heading (°)</th>
                </tr>
                </thead>
                <tbody>
                {legDetails.map((leg, index) => (
                    <tr key={index}>
                        <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{leg.from}</td>
                        <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{leg.to}</td>
                        <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{leg.distance}</td>
                        <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{leg.heading}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default LegDetails;
