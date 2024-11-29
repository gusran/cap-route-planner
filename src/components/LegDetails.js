// src/components/LegDetails.js

import React from 'react';
import { Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

function LegDetails({ legDetails }) {
    return (
        <div style={{ marginTop: '20px' }}>
            <Typography variant="h6" gutterBottom>
                Leg Details
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>From</TableCell>
                        <TableCell>To</TableCell>
                        <TableCell>Distance (NM)</TableCell>
                        <TableCell>Heading (°)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {legDetails.map((leg, index) => (
                        <TableRow key={index}>
                            <TableCell>{leg.from}</TableCell>
                            <TableCell>{leg.to}</TableCell>
                            <TableCell>{leg.distance}</TableCell>
                            <TableCell>{leg.heading}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default LegDetails;
