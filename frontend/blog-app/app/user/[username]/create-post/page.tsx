"use client";
import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useAuth } from "@/components/context/AuthContext";

export default function CreatePost() {
	const { username } = useAuth();
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [thumbnail_url, setThumbnail_url] = useState<File | null>(null);
	const { quill, quillRef } = useQuill({
		placeholder: "Start writing your post..."
	});
	const [height, setHeight] = useState(0);
	const [ok, setOk] = useState(false);

	// Handle thumbnail file selection
	const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) setThumbnail_url(e.target.files[0]);
	};

	// Function to handle post submission
	const handlePostSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const content = quill ? quill.root.innerHTML : ""; // Get content from Quill
		try {
			const formData = new FormData();
			const accessToken = getCookie("access_token");
			formData.append("title", title);
			formData.append("content", content);
			if (thumbnail_url) {
				formData.append("thumbnail_url", thumbnail_url);
			}

			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/create-post`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "multipart/form-data"
					},

					withCredentials: true
				}
			);

			if (response.status === 201) {
				alert("Post created successfully");
				setTitle(""); // Clear title
				if (quill) quill.root.innerHTML = ""; // Clear Quill editor content
				setThumbnail_url(null); // Clear thumbnail
			}
		} catch (error) {
			console.error("Failed to create post:", error);
		}
	};

	// Adjust container height based on screen size
	useEffect(() => {
		if (!username) {
			window.location.href = "/login";
			return;
		}
		const updateHeight = () => {
			const header = document.getElementById("header")?.clientHeight;
			const footer = document.getElementById("footer")?.clientHeight;
			setHeight(window.innerHeight - (header || 0) - (footer || 0) - 34);
		};
		updateHeight();
		window.addEventListener("resize", updateHeight);
		return () => {
			window.removeEventListener("resize", updateHeight);
		};
	}, []);

	return (
		<div style={{ minHeight: height }} className="container py-8">
			{/* Title Input */}
			<form onSubmit={handlePostSubmit}>
				<div>
					<input
						type="text"
						name="title"
						id="title"
						placeholder="Post Title goes here..."
						required
						className="px-4 py-2 outline-none my-4 w-full text-3xl shadow-md rounded-md bg-white/5"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>

				{/* Quill Editor */}
				<div style={{ width: "100%", height: "100%" }}>
					<div ref={quillRef} className="post-content" />
				</div>

				{/* Thumbnail Upload */}
				<div className="mt-8">
					<h1 className="poppins-bold text-2xl">Thumbnail Image</h1>
					<div className="w-96">
						<label
							htmlFor="thumbnail"
							className="w-fit self-center"
						>
							{thumbnail_url ? (
								<img
									src={URL.createObjectURL(thumbnail_url)}
									alt="Thumbnail Image"
									className="h-full w-full object-cover rounded-md"
								/>
							) : (
								<img
									src="/images/thumbnail.png" // Default image
									alt="Thumbnail Image"
									className="h-full w-full object-cover rounded-md"
								/>
							)}
							<input
								type="file"
								onChange={handleThumbnailChange}
								id="thumbnail"
								className="hidden"
								accept="image/*" // Only image files can be uploaded
							/>
						</label>
					</div>
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
				>
					Submit Post
				</button>
			</form>
		</div>
	);
}
