import Link from "next/link";

export default function Footer() {
    return (
		<div className="container mb-8" id="footer">
			<div className="grid md:grid-cols-2">
				<div className="flex flex-col gap-4">
					<div className="w-40 h-16 overflow-hidden flex items-center">
						<img src="/images/logo.svg" alt="Logo" />
					</div>
					<p>
						Lorem ipsum dolor, sit amet consectetur adipisicing
						elit. Tenetur, dignissimos id. Nam hic consequuntur
						nulla aliquam illo cumque quis saepe voluptatum
						accusantium blanditiis vel numquam voluptates vero
						doloremque, est quod!
					</p>
					<div className="h-[30px] flex gap-4">
						<img src="/images/instagram.png" alt="Instagram" className="h-[100%]" />
						<img src="/images/facebook.png" alt="" />
						<img src="/images/youtube.png" alt="" />
					</div>
				</div>
				<div>
                    <div className="flex md:justify-around justify-between mt-8 md:mt-0">
                        <ul className="flex flex-col gap-3">
                            <li className="poppins-bold text-xl">Links</li>
                            <Link href="/">Home</Link>
                            <Link href="/">Blog</Link>
                            <Link href="/">About</Link>
                            <Link href="/">Contact</Link>
                        </ul>
                        <ul className="flex flex-col gap-3">
                            <li className="poppins-bold text-xl">Tags</li>
                            <Link href="/">Style</Link>
                            <Link href="/">Fashion</Link>
                            <Link href="/">Coding</Link>
                            <Link href="/">Travel</Link>
                        </ul>
                        <ul className="flex flex-col gap-3">
                            <li className="poppins-bold text-xl">Social</li>
                            <Link href="/">Facebook</Link>
                            <Link href="/">Instagram</Link>
                            <Link href="/">TikTok</Link>
                            <Link href="/">Youtube</Link>
                        </ul>
                    </div>
				</div>
			</div>
		</div>
	);
}