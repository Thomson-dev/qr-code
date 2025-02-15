import React from 'react'
import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRScanner() {
    const [qrData, setQrData] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const scanner = new Html5QrcodeScanner("qr-reader", {
            fps: 10,
            qrbox: { width: 250, height: 250 },
        });

        scanner.render(
            (data) => {
                if (data) {
                    setQrData(data);
                    scanner.clear(); // Stop scanning after a successful scan
                    sendQrDataToBackend(data);
                }
            },
            (error) => console.log("Scanning error:", error)
        );

        return () => scanner.clear(); // Cleanup on component unmount
    }, []);

    const sendQrDataToBackend = async (data) => {
        try {
            const response = await fetch("http://localhost:5000/verify-qr", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ qrCode: data }),
            });

            const result = await response.json();
            setMessage(result.message);
        } catch (error) {
            console.error("Error sending QR code:", error);
        }
    };

    return (
        <div>
            <h2>Scan QR Code</h2>
            <div id="qr-reader"></div>
            <p>Scanned Data: {qrData}</p>
            <p>{message}</p>
        </div>
    );
}
