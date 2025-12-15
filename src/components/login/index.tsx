// pages/Login.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentAdmin, loginAdmin } from "../../service/Auth";

const Login = () => {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const navigate = useNavigate();
	useEffect(() => {
		const admin = getCurrentAdmin();
		if (admin) {
			// Jika sudah login, redirect ke home
			navigate("/home");
		}
	}, [navigate]);
	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const [focusedInput, setFocusedInput] = useState<string | null>(null);

	const handleFocus = (inputName: string) => {
		setFocusedInput(inputName);
	};

	const handleBlur = () => {
		setFocusedInput(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!username || !password) {
			setError("Username dan password harus diisi");
			return;
		}

		setLoading(true);

		try {
			const result = await loginAdmin(username, password);

			if (result.success) {
				// Redirect ke halaman home setelah login berhasil
				navigate("/home");
			} else {
				setError(result.error || "Login gagal");
			}
		} catch (err) {
			setError("Terjadi kesalahan saat login");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{/* <!-- Login Wrapper Area --> */}
			<div className="login-wrapper d-flex align-items-center justify-content-center">
				<div className="custom-container">
					<div className="text-center px-4">
						<img
							className="login-intro-img"
							src="/assets/img/logo.jpg"
							alt="Logo"
						/>
					</div>

					{/* <!-- Register Form --> */}
					<div className="register-form mt-4">
						<h6 className="mb-3 text-center">
							Silahkan masuk
						</h6>

						<form onSubmit={handleSubmit}>
							<div className="form-group">
								<input
									className={`form-control ${focusedInput === "username" ? "form-control-clicked" : ""
										}`}
									type="text"
									id="username"
									placeholder="Username"
									onFocus={() => handleFocus("username")}
									onBlur={handleBlur}
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									disabled={loading}
								/>
							</div>

							<div className="form-group position-relative">
								<input
									className={`form-control ${focusedInput === "password" ? "form-control-clicked" : ""
										}`}
									id="psw-input"
									placeholder="Enter Password"
									onFocus={() => handleFocus("password")}
									onBlur={handleBlur}
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									disabled={loading}
								/>
								<div
									className={`position-absolute ${showPassword ? "active" : ""
										}`}
									id="password-visibility"
									onClick={toggleShowPassword}
									style={{
										cursor: "pointer",
										top: "50%",
										right: "10px",
										transform: "translateY(-50%)",
									}}
								>
									{showPassword ? (
										<i className="bi bi-eye-slash"></i>
									) : (
										<i className="bi bi-eye"></i>
									)}
								</div>
							</div>

							{error && (
								<div className="alert alert-danger" role="alert">
									{error}
								</div>
							)}

							<button
								className="btn btn-primary w-100"
								type="submit"
								disabled={loading}
							>
								{loading ? (
									<>
										<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
										Loading...
									</>
								) : (
									"Masuk"
								)}
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;