// app/user/[username]/edit-post/[postId]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function EditPost({ params }: { params: { postId: string, username: string } }) {
    const {username} = params
	const { quill, quillRef } = useQuill({
		placeholder: "Edit your post..."
	});
	const router = useRouter();
	const postId = params.postId;
	const [title, setTitle] = useState("");
    const [thumbnail_url, setThumbnail_url] = useState<File | null>(null);
    const [height, setHeight] = useState(0);

    const id = localStorage.getItem("id") || "";

	useEffect(() => {
		// Fetch post data
		const fetchPost = async () => {
			const accessToken = getCookie("access_token");
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/`,
				{
					headers: { Authorization: `Bearer ${accessToken}` }
				}
			);
			const post = response.data;
			setTitle(post.title);
			quill?.clipboard.dangerouslyPasteHTML(post.content);
			setThumbnail_url(post.thumbnail_url);
		};

		if (quill) {
			fetchPost();
		}
    }, [quill, postId]);
    
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

	const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) setThumbnail_url(e.target.files[0]);
	};

	const handlePostUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		const content = quill ? quill.root.innerHTML : "";

		const formData = new FormData();
		const accessToken = getCookie("access_token");
		formData.append("title", title);
		formData.append("content", content);
		if (thumbnail_url) {
			formData.append("thumbnail_url", thumbnail_url);
		}

		try {
			const response = await axios.put(
				`${process.env.NEXT_PUBLIC_API_URL}/posts/edit/${postId}/`,
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
				alert("Post updated successfully");
				router.push(`/user/${username}/${id}/dashboard`);
			}
		} catch (error) {
			console.error("Failed to update post:", error);
		}
	};

	return (
		<div style={{ minHeight: height }} className="container py-8">
			<form onSubmit={handlePostUpdate}>
				<input
					type="text"
					placeholder="Post Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
					className="px-4 py-2 outline-none my-4 w-full text-3xl shadow-md rounded-md bg-white/5"
				/>

				<div style={{ width: "100%", height: "100%" }}>
					<div ref={quillRef} className="post-content" />
				</div>

				{/* <div className="thumbnail-upload">
					<label htmlFor="thumbnail">
						{thumbnail_url ? (
							<img
								src={
									typeof thumbnail_url === "string"
										? thumbnail_url
										: URL.createObjectURL(thumbnail_url)
								}
								alt="Thumbnail"
							/>
						) : (
							<span>Upload Thumbnail</span>
						)}
						<input
							type="file"
							id="thumbnail"
							onChange={handleThumbnailChange}
							className="hidden"
							accept="image/*"
						/>
					</label>
				</div> */}
				<div className="mt-8">
					<h1 className="poppins-bold text-2xl">Thumbnail Image</h1>
					<div className="w-96">
						<label
							htmlFor="thumbnail"
							className="w-fit self-center"
						>
							{thumbnail_url ? (
								<img
									src={
										typeof thumbnail_url === "string"
											? thumbnail_url
											: URL.createObjectURL(thumbnail_url)
									}
									alt="Thumbnail"
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
				<button
					type="submit"
					className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
				>
					Update Post
				</button>
			</form>
		</div>
	);
}
