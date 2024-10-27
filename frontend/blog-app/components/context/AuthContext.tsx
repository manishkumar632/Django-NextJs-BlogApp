'use client';
import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect
} from "react";
import { useRouter } from "next/navigation";
import { deleteCookie, getCookie } from "cookies-next";
import axios from "axios";

type AuthContextType = {
	isLoggedIn: boolean;
	login: () => void;
	logout: () => void;
	userID: string;
	setUserID: (id: string) => void;
	username: string;
	setUsername: (name: string) => void;
	email: string;
	setEmail: (email: string) => void;
	profilePic: string;
	setProfilePic: (url: string) => void;
	bio: string;
	setBio: (bio: string) => void;
	phone_number: string;
	setPhoneNumber: (phone_number: string) => void;
	gender: string;
	setGender: (gender: string) => void;
	posts: any[];
	setPosts: (posts: any[]) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userID, setUserID] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [profilePic, setProfilePic] = useState("");
	const [bio, setBio] = useState("");
	const [phone_number, setPhoneNumber] = useState("");
	const [gender, setGender] = useState("");
	const [posts, setPosts] = useState<any>([]);
	const router = useRouter();

	useEffect(() => {
		const savedUsername = localStorage.getItem("username") || "";
		const savedProfie_image = localStorage.getItem("profile_image") || "";
		setUsername(savedUsername)
		setProfilePic(savedProfie_image)
	}, [username]);

	const login = () => {
		setIsLoggedIn(true);
		localStorage.setItem("isLoggingIn", "true");
		router.push("/");
	};

	const logout = async () => {
		try {
			const accessToken = getCookie("access_token");
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/logout`,
				{},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
					withCredentials: true // Ensure cookies are sent with the request
				}
			);

			if (response.status === 205) {
				// console.log(response);
				// Logout successful
				deleteCookie("access_token");
				deleteCookie("refresh_token");
				localStorage.clear(); // Optionally clear local storage
				setUsername("");
				router.push("/"); // Redirect to login page or home
			}
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				username,
				setUsername,
				isLoggedIn,
				login,
				logout,
				userID,
				setUserID,
				email,
				setEmail,
				profilePic,
				setProfilePic,
				bio,
				setBio,
				phone_number,
				setPhoneNumber,
				gender,
				setGender,
				posts,
				setPosts
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
