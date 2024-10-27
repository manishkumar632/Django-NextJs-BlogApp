import Link from "next/link";

interface Post {
	id: number;
	title: string;
	content: string;
	thumbnail_url: string;
	created_at: string;
	author: {
		id: number;
		username: string;
		profile_image?: string;
	};
}

// Define the props for the Card component
interface CardProps {
	post: Post;
}

export default function Card({ post }: CardProps) {
	return (
		<div className="grid md:grid-cols-2">
			{/* image */}
			<img
				src={post.thumbnail_url}
				alt={post.title}
				className="w-[100%] rounded-md"
			/>
			<div className="flex flex-col justify-between p-2">
				<div className="flex gap-4">
					<div className="w-16 h-16 rounded-full">
						<img
							src={
								post.author.profile_image ||
								"/images/editorIcon.png"
							}
							alt="Author Image"
							className="w-[100%] h-[100%] rounded-full"
						/>
					</div>
					<div>
						<h1>{post.author.username}</h1>
						<p>{new Date(post.created_at).toLocaleDateString()}</p>
					</div>
				</div>
				<div className="text-justify">
					<h1 className="font-bold text-xl">{post.title}</h1>
					{/* <p>{post.content.substring(0, 100)}...</p> */}
				</div>
				<div>
					<Link
						href={`/blog/${post.id}/${encodeURIComponent(
							post.title
						)}`}
						className="decoration-black border-b-2 border-black"
					>
						Read More
					</Link>
				</div>
			</div>
			{/* text */}
		</div>
	);
}
