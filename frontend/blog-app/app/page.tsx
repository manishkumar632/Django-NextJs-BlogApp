'use client';
import CardList from "@/components/cardList/CardList";
import CategoryList from "@/components/categoryList/CategoryList";
import { useAuth } from "@/components/context/AuthContext";
import Featured from "@/components/featured/Featured";
import Menu from "@/components/menu/Menu";
import axios from "axios";
import { useEffect, useState } from "react";
export default function Home() {
	const {posts, setPosts} = useAuth();
	const [loading, setLoading] = useState(true); // State for loading indicator
	const [error, setError] = useState<Error | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_API_URL}/posts`,
				);
				setPosts(response.data); // Set fetched posts to state
				console.log(response.data)
			} catch (err) {
				console.error("Error fetching posts:", err);
				setError(err as Error);
			} finally {
				setLoading(false); // Set loading to false after fetching
				console.log(posts)
			}
		};

		fetchPosts(); // Call the function to fetch posts
	}, []); // Empty dependency array means this effect runs once on mount

	useEffect(() => {
		console.log("Posts updated:", posts); // Log posts when updated
	}, [posts]);
	if (loading) return (
		<div className="flex justify-center py-8">
			{/* display loading animation gif file */}
			<img
				src="https://res.cloudinary.com/dcvg9vrez/image/upload/v1730026404/animation/kyzecemdqy8uzqymsk2j.gif"
				alt="Loading animation"
				width={500}
				height={"auto"}
			/>
		</div>
	); // Display loading indicator
	if (error) return <div>Error loading posts.</div>; // Display error message
	return (
		<div className="mb-8">
			<Featured />
			<CategoryList />
			<div className="container grid md:grid-cols-4">
				<div className="col-span-3">
					<CardList />
				</div>
				<div>
					<Menu />
				</div>
			</div>
		</div>
	);
}
