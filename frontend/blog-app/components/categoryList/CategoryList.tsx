import CategoryCard from "./CategoryCard";

export default function CategoryList() {
	const categories = ["Style", "Health", "Food", "Travel", "Fitness", "Entertainment", "Tech"];
	const colors = [
		"#236487",
		"#475628",
		"#824746",
		"#537546",
		"#5c5c5c",
		"#826495",
	]
	return (
		<div>
			<div className="container mb-8">
				<h1 className="text-3xl poppins-black mb-4">
					Popular Categories
				</h1>
				<div className="flex gap-4">
					<CategoryCard category={categories[0]} color={colors[0]} />
					<CategoryCard category={categories[1]} color={colors[1]} />
					<CategoryCard category={categories[2]} color={colors[2]} />
					<CategoryCard category={categories[4]} color={colors[4]} />
					<CategoryCard category={categories[5]} color={colors[5]} />
				</div>
			</div>
		</div>
	);
}
