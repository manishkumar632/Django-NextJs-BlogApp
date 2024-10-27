export default function EditorPick() {
	return (
		<div>
			<div className="mb-4">
				<p className="text-slate-400">Choosen by editor</p>
				<p className="poppins-black text-xl">Editor Pick</p>
			</div>
			<div className="flex flex-col gap-4">
				<div className="flex gap-2">
					<img src="/images/editorIcon.png" alt="Editor Icon" className="w-16 h-[100%]" />
                    <div className="flex flex-col text-justify">
                        <p className="bg-green-400 max-w-fit pl-3 pr-3 rounded-full">Category</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo</p>
                        <p className="flex gap-4"><span className="text-slate-700">Author Name</span><span className="text-slate-400">10-11-2024</span></p>
                    </div>
				</div>
				<div className="flex gap-2">
					<img src="/images/editorIcon.png" alt="Editor Icon" className="w-16 h-[100%]" />
                    <div className="flex flex-col text-justify">
                        <p className="bg-green-400 max-w-fit pl-3 pr-3 rounded-full">Category</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo</p>
                        <p className="flex gap-4"><span className="text-slate-700">Author Name</span><span className="text-slate-400">10-11-2024</span></p>
                    </div>
				</div>
				<div className="flex gap-2">
					<img src="/images/editorIcon.png" alt="Editor Icon" className="w-16 h-[100%]" />
                    <div className="flex flex-col text-justify">
                        <p className="bg-green-400 max-w-fit pl-3 pr-3 rounded-full">Category</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo</p>
                        <p className="flex gap-4"><span className="text-slate-700">Author Name</span><span className="text-slate-400">10-11-2024</span></p>
                    </div>
				</div>
			</div>
		</div>
	);
}
