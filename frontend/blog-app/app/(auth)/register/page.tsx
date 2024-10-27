"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { setCookie, getCookie } from "cookies-next";
import { useAuth } from "@/components/context/AuthContext";

const Signup = () => {
	const { setUsername } = useAuth();
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		bio: "",
		gender: "",
		phone_number: ""
	});
	const [profileImage, setProfileImage] = useState<File | null>(null);
	const router = useRouter();

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) setProfileImage(e.target.files[0]);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const data = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			// Append phone_number only if it's not an empty string
			if (key === "phone_number" && value === "") return; // Skip if empty
			data.append(key, value); // Append other fields
		});
		if (profileImage) data.append("profile_image", profileImage);
		// if phone_number is empty, set it to null

		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/register`,
				data
			);
			if (response.status === 201) {
				const { access, refresh } = response.data;
				setCookie("access_token", access, { path: "/" });
				setCookie("refresh_token", refresh, { path: "/" });
				// set email, username, id, profile_image, gender to localstorage
				localStorage.setItem("email", formData.email);
				localStorage.setItem("username", formData.username);
				setUsername(formData.username);
				localStorage.setItem("id", response.data.user.id);
				localStorage.setItem(
					"profile_image",
					response.data.user.profile_image
				);
				localStorage.setItem("gender", formData.gender);
				router.push("/");
			}
		} catch (error) {
			console.log(formData);
			console.error("Registration failed:", error);
		}
	};
	return (
		<div className="container py-8 flex justify-center">
			<form onSubmit={handleSubmit} className="flex flex-col gap-4 w-96">
				{/* profile pic in rounded-full */}
				<label
					htmlFor="profile_image" className="w-fit rounded-full self-center"
				>
					<div className="h-20 w-20 rounded-full overflow-hidden border-2 border-gray-300">
						{profileImage ? (
							<img
								src={URL.createObjectURL(profileImage)}
								alt="Profile"
								className="h-full w-full object-cover"
							/>
						) : (
							<img
								src="/icons/profile_image.png" // Default image
								alt="Profile"
								className="h-full w-full object-cover"
							/>
						)}
					</div>
					<input
						type="file"
						onChange={handleFileChange}
						id="profile_image"
						className="hidden"
						accept="image/*" // Ensures only image files can be uploaded
					/>
				</label>
				<div className="flex flex-col">
					<label htmlFor="username">Username</label>
					<input
						type="text"
						name="username"
						id="username"
						placeholder="John Doe"
						className="outline-none border-none shadow-md p-2 rounded-md"
						onChange={handleInputChange}
					/>
				</div>
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
					Sign Up
				</button>
				<div className="flex w-full border-b-2 border-slate-500"></div>
				<h1 className="text-center">SignUp with</h1>
				<div className="h-8 flex gap-4 justify-center">
					<img
						src="/images/google.png"
						alt="Google"
						className="h-[100%]"
					/>
					<img
						src="/images/facebook.png"
						alt="Facebook"
						className="h-[100%]"
					/>
					<img
						src="/images/github.png"
						alt="GitHub"
						className="h-[100%]"
					/>
				</div>
			</form>
		</div>
	);
};

export default Signup;
