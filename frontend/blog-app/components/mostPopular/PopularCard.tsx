interface CardProps {
	color?: string; // Adding an optional color prop
}
export default function PopularCard({ color }: CardProps) {
	return (
		<div className="flex flex-col">
			<div
				style={{ backgroundColor: color }}
				className="max-w-fit pl-4 pr-4 pt-1 pb-1 rounded-full bg-red-400"
			>
				<p>Category</p>
			</div>
			<p className="poppins-semibold">
				Lorem ipsum dolor sit amet consectetur adipisicing elit.
			</p>
			<div className="flex flex-wrap lg:flex-nowrap lg:gap-4">
				<h1>Author Name</h1>
				<p>2024-11-25</p>
			</div>
		</div>
	);
}
