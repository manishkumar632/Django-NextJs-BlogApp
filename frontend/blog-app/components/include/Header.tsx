"use client";
import Image from "next/image";
import ToggleTheme from "../theme/ToggleTheme";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
export default function Header() {
	const { username, logout, setUsername, profilePic, setProfilePic } = useAuth();
	const [id, setId] = useState("");
	useEffect(() => {
		const savedUsername = localStorage.getItem("username") || "";
		setUsername(savedUsername);
		const savedID = localStorage.getItem("id") || "";
		setId(savedID);
	}, [username]);
	return (
		<div id="header">
			<div className="container">
				<div className="flex justify-between items-center">
					<div className="w-[200px] h-[90px] flex items-center overflow-hidden">
						<img src="/images/logo.svg" alt="Logo" />
					</div>
					<div className="links">
						<ul className="flex gap-2 sm:gap-4 md:gap-6 lg:gap-10 font-bold items-center">
							<li>
								<Link href="/">Home</Link>
							</li>
							<li>
								<a href="#">About</a>
							</li>
							<li>
								<a href="#">Contact</a>
							</li>
							{username ? (
								<div className="flex gap-2 sm:gap-4 md:gap-6 lg:gap-10 items-center">
									<li>
										<Link
											href={`/user/${username}/create-post`}
										>
											Create Post
										</Link>
									</li>
									<li>
										<Link
											href={`/user/${username}/${id}/dashboard`}
										>
											Dashboard
										</Link>
									</li>
									<li>
										<button onClick={logout}>Logout</button>
									</li>
									<li>
										<div className="flex items-center w-16 h-16 rounded-full">
											{profilePic ? (
												<img
													src={profilePic}
													alt="User Icon"
													className="w-full h-full rounded-full"
												/>
											) : (
												<img
													src="https://api.multiavatar.com/random.svg" // Default avatar URL
													alt="Default Avatar"
													className="w-full h-full rounded-full"
												/>
											)}
										</div>
									</li>
								</div>
							) : (
								<div className="flex gap-2 sm:gap-4 md:gap-6 lg:gap-10">
									<li>
										<Link href="/login">Login</Link>
									</li>
									<li>
										<Link href="/register">Register</Link>
									</li>
								</div>
							)}
						</ul>
					</div>
					<div className="h-[30px] flex gap-4">
						<img src="/images/instagram.png" alt="" />
						<img src="/images/facebook.png" alt="" />
						<img src="/images/youtube.png" alt="" />
						<div className="flex items-center">
							<ToggleTheme />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
