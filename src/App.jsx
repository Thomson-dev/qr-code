import React, { useEffect, useState, useCallback } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScanner = () => {
    const [qrData, setQrData] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const scanner = new Html5QrcodeScanner("qr-reader", {
            fps: 10,
            qrbox: { width: 250, height: 250 },
        });

        scanner.render(handleScanSuccess, handleScanError);

        return () => scanner.clear(); // Cleanup on component unmount
    }, []);

    // ✅ Extracted function for better readability
    const handleScanSuccess = useCallback((data) => {
        if (!data) return;
        setQrData(data);
        sendQrDataToBackend(data);
    }, []);

    // ✅ Logging errors for debugging
    const handleScanError = useCallback((error) => {
        console.warn("QR Scan Error:", error);
    }, []);

    // ✅ API Call Function with Improved Error Handling
    const sendQrDataToBackend = async (data) => {
        try {
            const response = await fetch("http://localhost:5000/verify-qr", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ qrCode: data }),
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            const result = await response.json();
            setMessage(result.message || "Verification complete.");
        } catch (error) {
            console.error("QR Code Submission Error:", error);
            setMessage("🚨 Failed to verify QR code. Please try again.");
        }
    };

    return (
        <div>
            <h2>Scan QR Code</h2>
            <div id="qr-reader"></div>
            <p>Scanned Data: <strong>{qrData || "Waiting for scan..."}</strong></p>
            <p>{message && <strong>{message}</strong>}</p>
        </div>
    );
};

export default QRScanner;
