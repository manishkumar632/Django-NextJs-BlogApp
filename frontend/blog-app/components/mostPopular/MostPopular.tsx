import PopularCard from "./PopularCard";

export default function MostPopular() {
    const color = {
        color1: '#726482',
        color2: '#736373',
        color3: '#652453',
        color4: '#527537'
    }
    return (
		<div className="flex flex-col gap-4 mb-8">
			<PopularCard color={color.color1} />
			<PopularCard color={color.color2} />
			<PopularCard color={color.color3} />
			<PopularCard color={color.color4} />
		</div>
	);
}