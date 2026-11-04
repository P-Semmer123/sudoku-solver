import { Link } from "react-router";

function RegisterPage() {

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

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
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                />

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