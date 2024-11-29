// src/components/LegDetails.js

import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function LegDetails({ legDetails }) {
    if (legDetails.length === 0) {
        return <Typography variant="body1">Add at least two POIs to see leg details.</Typography>;
    }

    return (
        <div id="leg-details" style={{ marginTop: '20px' }}>
            <TableContainer component={Paper}>
                <Table aria-label="leg details table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Leg Number</TableCell>
                            <TableCell>From</TableCell>
                            <TableCell>To</TableCell>
                            <TableCell>Distance (NM)</TableCell>
                            <TableCell>Heading (°)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {legDetails.map((leg, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{leg.from}</TableCell>
                                <TableCell>{leg.to}</TableCell>
                                <TableCell>{leg.distance}</TableCell>
                                <TableCell>{leg.heading}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default LegDetails;
