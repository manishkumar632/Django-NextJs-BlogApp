import CardList from "@/components/cardList/CardList";
import Menu from "@/components/menu/Menu";

export default function Blog() {
	return (
		<div className="container">
			<h1 className="flex bg-yellow-500 justify-center">Blog</h1>
			<div className="grid md:grid-cols-4">
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
