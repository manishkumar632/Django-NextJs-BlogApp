"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { useAuth } from "@/components/context/AuthContext";

const Login = () => {
	const { setUsername, setUserID, setProfilePic } = useAuth();
	const [formData, setFormData] = useState({
		email: "",
		password: ""
	});
	const router = useRouter();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/login`,
				formData
			);
			if (response.status === 200) {
				const { access, refresh } = response.data;
				setCookie("access_token", access, { path: "/" });
				setCookie("refresh_token", refresh, { path: "/" });

				// Set user data in localStorage
				localStorage.setItem("email", formData.email);
				localStorage.setItem("username", response.data.user.username);
				localStorage.setItem("id", response.data.user.id);
				localStorage.setItem(
					"profile_image",
					response.data.user.profile_image
				);

				// Set username and userID in context
				setUsername(response.data.user.username);
				setUserID(response.data.user.id);
				setProfilePic(response.data.user.profile_image);

				router.push("/"); // Redirect after successful login
			}
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	return (
		<div className="container py-8 flex justify-center">
			<form onSubmit={handleSubmit} className="flex flex-col gap-4 w-96">
				<div className="flex flex-col">
					<label htmlFor="email">Email ID</label>
					<input
						type="text"
						name="email"
						id="email"
						placeholder="something@example.com"
						className="outline-none border-none shadow-md p-2 rounded-md"
						onChange={handleInputChange}
					/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						id="password"
						placeholder="●●●●●●●●"
						className="outline-none border-none shadow-md p-2 rounded-md"
						onChange={handleInputChange}
					/>
				</div>
				<button
					type="submit"
					className="w-full bg-blue-500 text-white py-2 rounded"
				>
					Log In
				</button>
			</form>
		</div>
	);
};

export default Login;
