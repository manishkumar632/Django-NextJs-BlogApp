export default function Featured() {
	return (
		<div>
			<div className="container mb-8">
				<div className="flex items-center text-7xl text-justify mb-8">
					<p>
						<span className="poppins-black">Hey, Manish here! </span>
						<span>Discover My stories and creative ideas.</span>
					</p>
				</div>
				<div className="flex gap-6 h-[300px] lg:h-[500px] md:h-[400px]">
					{/* image */}
					<img
						src="/images/blog21.jpg"
						alt="Featured Image"
						className="rounded-lg"
					/>
					{/* description */}
					<div className="flex flex-col justify-center gap-2 min-w-96 text-justify">
						<h1 className="text-3xl font-bold">
							Lorem ipsum dolor sit amet consectetur adipisicing
							elit.
						</h1>
						<h1 className="text-xl">
							Lorem ipsum, dolor sit amet consectetur adipisicing
							elit. Magni, delectus harum cupiditate porro
							possimus odit explicabo voluptatibus provident
							temporibus hic consequuntur tempore a, ex rerum nam
							fugit corporis. Dicta, natus?
						</h1>
						<button className="bg-blue-500 p-2 rounded-md text-white font-medium self-start">
							Read More
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}