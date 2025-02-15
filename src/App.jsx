import React from 'react'
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

export default function QRScanner() {
    const [qrData, setQrData] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const scanner = new Html5QrcodeScanner("qr-reader", {
            fps: 10,  // Scans per second
            qrbox: { width: 250, height: 250 }, // QR scanning area
        });

        scanner.render(handleScan, (error) => console.log(error));

        return () => scanner.clear(); // Cleanup scanner on unmount
    }, []);

    const handleScan = async (data) => {
        if (data) {
            setQrData(data);

            // Send QR code to backend for validation
            const response = await fetch("http://localhost:5000/verify-qr", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ qrCode: data }),
            });

            const result = await response.json();
            setMessage(result.message);
        }
    };

    return (
        <div>
            <h2>Scan QR Code</h2>
            <div id="qr-reader"></div>
            <p>{message}</p>
        </div>
    );
}
