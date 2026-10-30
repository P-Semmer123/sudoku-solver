import { useState } from 'react';

function HelloButton() {
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    async function callBackend() {
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch("/api/hello", {method: "GET"});
            if (!response.ok) {
                throw new Error(
                    `HTTP error: ${response.status}`
                );
            }

            const data = await response.text();
            setMessage(data);

        } catch (err) {
            setError("Backend unreachable.");
            console.error(err);

        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <button
                onClick={callBackend}
                disabled={loading}
            >
                {loading ? "Loading..." : "Call Backend"}
            </button>

            {message && <p>{message}</p>}

            {error && <p>{error}</p>}
        </div>
    );
}

export default HelloButton;