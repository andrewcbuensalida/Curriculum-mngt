import { useEffect, useRef } from "react";
import {
	select,
	forceSimulation,
	forceManyBody,
	forceLink,
	forceCenter,
	drag,
} from "d3";
import useForce, { MANY_BODY_STRENGTH } from "../hooks/useForce";

function Force({ courseData }) {
	const { nodes, links } = useForce(courseData);
  // console.log(`This is nodes: `, nodes)
  // console.log(`This is links: `, links)
	const svgRef = useRef(null);

	// will be called initially and on every data change
	useEffect(() => {
		const svg = select(svgRef.current);
		const width = +svg.attr("width");
		const height = +svg.attr("height");
		const centerX = width / 2;
		const centerY = height / 2;

		const simulation = forceSimulation(nodes)
			.force("charge", forceManyBody().strength(MANY_BODY_STRENGTH)) // first argument "charge" is any name
			.force(
				"link",
				forceLink(links).distance((link) => link.distance)
			)
			.force("center", forceCenter(centerX, centerY));

		const dragInteraction = drag().on("drag", (event, node) => {
			node.fx = event.x;
			node.fy = event.y;
			simulation.alpha(1);
			simulation.restart();
		});

		const lines = svg
			.selectAll("line")
			.data(links)
			.enter()
			.append("line")
			.attr("stroke", (link) => link.color || "white");

		const circles = svg
			.selectAll("circle")
			.data(nodes)
			.enter()
			.append("circle")
			.attr("fill", (node) => node.color || "gray")
			.attr("r", (node) => node.size)
			.call(dragInteraction);

		const text = svg
			.selectAll("text")
			.data(nodes)
			.enter()
			.append("text")
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "middle")
			.attr("fill", "white")
			.style("pointer-events", "none")
			.text((node) => node.title.slice(0,16));

		simulation.on("tick", () => {
			circles.attr("cx", (node) => node.x).attr("cy", (node) => node.y);
			text.attr("x", (node) => node.x).attr("y", (node) => node.y);

			lines
				.attr("x1", (link) => link.source.x)
				.attr("y1", (link) => link.source.y)
				.attr("x2", (link) => link.target.x)
				.attr("y2", (link) => link.target.y);
		});
	}, [svgRef]);

	return <svg id="container" width="960" height="960" ref={svgRef}></svg>;
}

export default Force;