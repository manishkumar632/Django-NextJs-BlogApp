"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import DOMPurify from "dompurify";
import Link from "next/link";
export default function UserPostsPage({ params }: {
	params: {
		username: string;
		id: string;
	}
}) {
	const userId = params.id;

	const [posts, setPosts] = useState<any | null>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchUserPosts = async () => {
			try {
				const accessToken = getCookie("access_token");
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_API_URL}/posts/user/${userId}/`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`
						}
					}
				);

				// Sanitize the content before setting it in state
				const sanitizedContent = DOMPurify.sanitize(
					response.data.content
				);
				setPosts(response.data);
			} catch (err) {
				setError(err as Error);
			} finally {
				setLoading(false);
			}
		};

		fetchUserPosts();
	}, [userId]);

	const handleDeletePost = async (postId: number) => {
		try {
			const accessToken = getCookie("access_token");
			await axios.delete(
				`${process.env.NEXT_PUBLIC_API_URL}/posts/delete/${postId}/`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				}
			);
			setPosts((prevPosts: any) =>
				prevPosts.filter((post: any) => post.id !== postId)
			);
		} catch (err) {
			console.error("Error deleting post:", err);
		}
	};

	useEffect(() => {
		console.log("Posts updated:", posts);
	}, [posts]);

	if (loading) return <div>Loading posts...</div>;
	if (error) return <div>Error fetching posts: {error.message}</div>;

	return (
		<div className="container my-8">
			<h1 className="text-3xl poppins-bold">Your Posts</h1>
			{posts.length === 0 ? (
				<p>No posts found for this user.</p>
			) : (
				<ul className="flex flex-col gap-4">
					{posts.map((post: any) => (
						<li
							key={post.id}
							className="flex justify-between border-2 rounded-md py-2 px-4 shadow-md"
						>
							<div className="flex gap-4">
								{/* <div
								className="mb-8"
								dangerouslySetInnerHTML={{
									__html: post.content
								}}
							/> */}
								<div className="h-24 w-24 flex items-center justify-center">
									<img
										src={post.thumbnail_url}
										alt={post.title}
										className="h-full object-cover rounded-md"
									/>
								</div>
								<div className="flex flex-col justify-between">
									<div>
										<h1>Post Title:</h1>
										<h2>{post.title}</h2>
									</div>
									<div>
										<h1>{post.created_at.substring(0, 10)}</h1>
									</div>
								</div>
							</div>
							<div className="flex flex-col justify-between items-center">
								{/* edit and delete icon */}
								<Link href={`/user/${params.username}/edit-post/${post.id}`}>
									<i className="bx bx-edit text-3xl"></i>
								</Link>
								<img
									src="/icons/delete.png"
									alt="Delete Icon"
									className="w-6 h-6"
									onClick={() => handleDeletePost(post.id)}
								/>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
