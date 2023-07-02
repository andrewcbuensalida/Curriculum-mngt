import { colors } from "./colors";

export const nodes = [];
export const links = [];

const MAIN_NODE_SIZE = 40;
const CHILD_NODE_SIZE = 15;
const DEFAULT_DISTANCE = 80; // between lessons and courses
const MAIN_NODE_DISTANCE = 80; // between courses and users
export const MANY_BODY_STRENGTH = -40;

let i = 0; // for colors

// for courses and users
const addMainNode = (node) => {
	node.size = MAIN_NODE_SIZE;
	// node.color = colors[i++][1];
	node.color = "#9D4452";
	nodes.push(node);
  return node
};

// for lessons
const addChildNode = (
	parentNode,
	childNode,
	size = CHILD_NODE_SIZE,
	distance = DEFAULT_DISTANCE
) => {
	childNode.size = size;
	childNode.color = parentNode.color;
	nodes.push(childNode);
	links.push({
		source: parentNode,
		target: childNode,
		distance,
		color: parentNode.color,
	});
};

// to connect lessons to courses
const assembleChildNode = (parentNode, id, title) => {
	const childNode = { id, title };
	addChildNode(parentNode, childNode);
};

// to connect courses to users
const connectMainNodes = (source, target) => {
	links.push({
		source,
		target,
		distance: MAIN_NODE_DISTANCE,
		color: source.color,
	});
};



// connectMainNodes(artsWeb, socialImpactCommons);
// connectMainNodes(artsWeb, cast);
// connectMainNodes(socialImpactCommons, cast);
// connectMainNodes(ambitioUS, cast);
// connectMainNodes(ambitioUS, socialImpactCommons);
// connectMainNodes(ambitioUS, artsWeb);

function useForce(courseData) {
	//  example courseData = [{
	//     "identifier": "PL4LFuHwItvKbdK-ogNsOx2X58hHGeQm8c",
	//     "title": "Blazor Shopping Cart Application",
	//     "teacher": "Gavin Lon",
	//     "lessons": [
	//         {
	//             "title": "Blazor (WebAssembly) and Web API on .NET 6 (C#) - Let’s Build a Shopping Cart Application - Part 4",
	//             "identifier": "T9-FULwMIkU4"
	//         },
	//         {
	//             "title": "Blazor (WebAssembly) and Web API on .NET 6 (C#) - Let’s Build a Shopping Cart Application - Part 3",
	//             "identifier": "T9-FULwMIkU3"
	//         },
	//         {
	//             "title": "Blazor (WebAssembly) and Web API on .NET 6 (C#) - Let’s Build a Shopping Cart Application - Part 2",
	//             "identifier": "T9-FULwMIkU2"
	//         },
	//         {
	//             "title": "Blazor (WebAssembly) and Web API on .NET 6 (C#) - Let’s Build a Shopping Cart Application - Part 1",
	//             "identifier": "T9-FULwMIkU1"
	//         }
	//     ],
	//     "enrolled": true
	// }]

	for (let i = 0; i < courseData.length; i++) {
		// build course nodes and user nodes. add id attribute
		const mainNode = addMainNode({ ...courseData[i], id: courseData[i].identifier });

		// build and connect lessons to courses. add id attribute
		for (let j = 0; j < courseData[i].lessons.length; j++) {
			assembleChildNode(
				mainNode,
				courseData[i].lessons[j].identifier,
				courseData[i].lessons[j].title
			);
		}
	}
	return { nodes, links };
}

export default useForce;
