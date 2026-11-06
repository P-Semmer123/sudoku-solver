import { useState } from "react";
import { Link, useNavigate } from "react-router";

type RegisterRequest = {
    username: string,
    password: string
}

function RegisterPage() {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordRepeat, setPasswordRepeat] = useState<string>("");

    const passwordMismatch = password !== passwordRepeat;
    
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();

    function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
    }

    function handlePasswordRepeatChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPasswordRepeat(event.target.value);
    }

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (passwordMismatch || loading) {
            return;
        }

        registerUser({username, password});
    }

    async function registerUser(userData: RegisterRequest) {
        setLoading(true);
        setError("");

        try {
            const csrfResponse = await fetch("/api/auth/csrf");

            if (!csrfResponse.ok) {
                throw new Error("Couldn't retrieve CSRF token.");
            }

            const csrfData: {token: string} = await csrfResponse.json();
            
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfData.token
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                // Request might have hit CSRF protection of Spring Security.
                if (response.status === 403) {
                    throw new Error("Request forbidden. Check security config.")
                }
                
                // When developing, vite proxy returns 502 if the backend is offline.
                if (response.status === 502) {
                    throw new Error("Could not connect to server.");
                }
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            navigate("/");

        } catch (err) {
            if (err instanceof TypeError) {
                setError("Could not connect to server.");
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }

            console.error(err);

        } finally {
            setLoading(false);
        }
    }

    return(
        <div>
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                    minLength={3}
                    maxLength={50}
                    pattern="[A-Za-z0-9]+"
                    title="Username must contain 3-50 alphanumeric ASCII characters."
                    autoComplete="username" // Can be picked up by browsers and password managers
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    minLength={8}
                    maxLength={72}
                    pattern="[\\x20-\\x7E]+"
                    title="Password must contain 8-72 printable ASCII characters."
                    autoComplete="new-password"
                />

                <input
                    type="password"
                    name="passwordRepeat"
                    placeholder="Repeat password"
                    value={passwordRepeat}
                    onChange={handlePasswordRepeatChange}
                    required
                    minLength={8}
                    maxLength={72}
                    pattern="[\\x20-\\x7E]+"
                    autoComplete="new-password"
                />

                {passwordMismatch && (
                    <p role="alert">
                        Passwords do not match!
                    </p>
                )}

                {error && (
                    <p role="alert">
                        {error}
                    </p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>

            <Link to="/">
                Back to Sudoku
            </Link>
        </div>
    )
}

export default RegisterPage