import localFont from "next/font/local";
import MostPopular from "../mostPopular/MostPopular";
import DiscoverByCategory from "./DiscoverByCategory";
import EditorPick from "./EditorPick";

export default function Menu() {
	return (
		<div className="pl-2">
			<div className="h-16 p-2 mb-4">
				<h1>What's hot</h1>
				<h1 className="text-xl poppins-black">Most Popular</h1>
			</div>
			<div className="pl-2">
				<MostPopular />
				<DiscoverByCategory />
				<EditorPick />
			</div>
		</div>
	);
}
