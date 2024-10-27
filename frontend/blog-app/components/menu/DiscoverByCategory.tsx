import Link from "next/link";

export default function DiscoverByCategory() {
    return (
        <div className="mb-8">
            <div className="mb-4">
                <p className="text-slate-400">Discover by category</p>
                <p className="poppins-black text-xl">Categories</p>
            </div>
			<div className="flex gap-4 md:flex-wrap text-nowrap">
				<div className="bg-green-200 pl-3 pr-3 rounded-md">
					<Link href="/category">Style</Link>
				</div>
				<div className="bg-red-200 pl-3 pr-3 rounded-md">
					<Link href="/category">Entertainment</Link>
				</div>
				<div className="bg-violet-200 pl-3 pr-3 rounded-md">
					<Link href="/category">Life Style</Link>
				</div>
				<div className="bg-pink-200 pl-3 pr-3 rounded-md">
					<Link href="/category">Health</Link>
				</div>
				<div className="bg-orange-200 pl-3 pr-3 rounded-md">
					<Link href="/category">Fashion</Link>
				</div>
				<div className="bg-sky-200 pl-3 pr-3 rounded-md">
					<Link href="/category">Travel</Link>
				</div>
			</div>
		</div>
	);
}