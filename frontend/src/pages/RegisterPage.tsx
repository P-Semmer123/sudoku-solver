import { useState } from "react";
import { Link } from "react-router";

function RegisterPage() {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordRepeat, setPasswordRepeat] = useState<string>("");

    const passwordMismatch = password !== passwordRepeat;

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

        if (passwordMismatch) {
            return;
        }

        const formData = new FormData(event.currentTarget);
        
        registerUser(formData);
    }

    async function registerUser(formData: FormData) {
        // TODO: Actual API call.
        console.log(formData.get("username"));
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

                <button type="submit">
                    Register
                </button>
            </form>

            <Link to="/">
                Back to Sudoku
            </Link>
        </div>
    )
}

export default RegisterPage