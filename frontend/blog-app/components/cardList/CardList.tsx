import { useAuth } from "../context/AuthContext";
import Pagination from "../pagination/Pagination";
import Card from "./Card";

export default function CardList() {
	const {posts} = useAuth();
	return (
		<div className="pr-2">
			<div className="mb-4 h-16 pt-2">
				<p className="text-3xl poppins-black">Recent Post</p>
			</div>
			<div className="flex flex-col gap-4 mb-8">
				{posts.map((post) => (
					<Card key={post.id} post={post} />
				))}
			</div>
			<div className="flex justify-between">
				<button className="bg-red-500 w-32 rounded-md pt-2 pb-2">
					Previous
				</button>
				<button className="bg-green-500 w-32 rounded-md">Next</button>
			</div>
		</div>
	);
}
