interface CategoryCardProps {
    category?: string,
    color?: string
}
export default function CategoryCard({category, color}: CategoryCardProps) {
    return (
		<div>
			<div style={{ backgroundColor: color }} className="flex gap-2 font-bold items-center h-16 pl-8 pr-8 pt-2 pb-2 max-w-fit rounded-md">
				<img
					src="/images/style.png"
					alt="Style"
					className="rounded-full border h-[100%]"
				/>
				<p>{category}</p>
			</div>
		</div>
	);
}