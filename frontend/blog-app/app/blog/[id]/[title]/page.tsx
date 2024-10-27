"use client";
import { useEffect, useState } from "react";
import Menu from "@/components/menu/Menu";
import axios from "axios";
import DOMPurify from "dompurify";

export default function SingleBlogPage({
	params
}: {
	params: { id: string; title: string; slug: string[] };
}) {
	const postId = params.id; // Assuming the first part of the slug is the post ID
	const [post, setPost] = useState<any | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchPost = async () => {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/` // Ensure the API endpoint is correct
				);
				// Sanitize the content before setting it in state
				const sanitizedContent = DOMPurify.sanitize(
					response.data.content
				);
				response.data.content = sanitizedContent;
				setPost(response.data);
			} catch (err) {
				setError(err as Error);
			} finally {
				setLoading(false);
			}
		};

		fetchPost();
	}, [postId]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error fetching post: {error.message}</div>;
	}

	if (!post) {
		return <div>Post not found.</div>;
	}

	return (
		<div className="container mb-8">
			<div className="flex lg:grid lg:grid-cols-2 flex-1 flex-col lg:flex-row mb-8">
				<div className="grid">
					<div className="flex items-center mb-4">
						<h1 className="poppins-bold text-5xl">{post.title}</h1>
					</div>
					<div className="flex h-16 gap-4 items-center self-end">
						<img
							src={
								post.author.profile_image ||
								"/images/editorIcon.png"
							}
							alt="Editor Icon"
							className="h-[100%]"
						/>
						<div>
							<p>{post.author.username}</p>
							<p>
								{new Date(post.created_at).toLocaleDateString()}
							</p>
						</div>
					</div>
				</div>
				<div>
					<img
						src={post.thumbnail_url}
						alt="Blog Image"
						className="rounded-md"
					/>
				</div>
			</div>
			<div className="flex lg:grid lg:grid-cols-3 flex-1 flex-col lg:flex-row">
				<div className="lg:col-span-2">
					<div
						className="mb-8"
						dangerouslySetInnerHTML={{ __html: post.content }}
					/>
				</div>
				<div>
					<Menu />
				</div>
			</div>
		</div>
	);
}
