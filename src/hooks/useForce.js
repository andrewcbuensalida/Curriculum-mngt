import { colors } from "./colors";

export const courseNodes = [];
export const lessonNodes = [];
export const userNodes = [];
export const links = [];

const MAIN_NODE_SIZE = 40;
const CHILD_NODE_SIZE = 15;
const DEFAULT_DISTANCE = 100; // between lessons and courses
const MAIN_NODE_DISTANCE = 200; // between courses and users
export const MANY_BODY_STRENGTH = -50; // negative is farther

let i = 0; // for colors

// for courses and users
const addMainNode = (nodes, node, color) => {
	node.size = MAIN_NODE_SIZE;
	// node.color = colors[i++][1];
	node.color = color;
	nodes.push(node);
	return node;
};

// for lessons
const addChildNode = (
	nodes,
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
const assembleChildNode = (nodes, parentNode, id, title) => {
	const childNode = { id, title };
	addChildNode(nodes, parentNode, childNode);
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

function useForce({ courseData, usersData }) {
	//  example courseData = [{
	//     "identifier": "PL4LFuHwItvKbdK-ogNsOx2X58hHGeQm8c",
	//     "title": "Blazor Shopping Cart Application",
	//     "teacher": "Gavin Lon",
	//     "lessons": [
	//         {
	//             "title": "Blazor (WebAssembly) and Web API on .NET 6 (C#) - Let’s Build a Shopping Cart Application - Part 4",
	//             "identifier": "T9-FULwMIkU4"
	//         },
	//     ],
	//     "enrolled": true
	// }]

	// example userData = [
	//   {
	//     "name": "Jack S",
	//     "username": "jack",
	//     "roles": "ROLE_USER",
	//     "coursesIdentifiers": [
	//         "PL4LFuHwItvKbdK-ogNsOx2X58hHGeQm8c"
	//     ]
	//   }
	// ]

	// build user nodes
	for (let i = 0; i < usersData.length; i++) {
		addMainNode(userNodes, {
			...usersData[i],
			id: usersData[i].username,
		}, 'blue');
	}

	// build course and lesson nodes and connect to users
	for (let i = 0; i < courseData.length; i++) {
		// build course nodes. add id attribute
		const courseNode = addMainNode(courseNodes, {
			...courseData[i],
			id: courseData[i].identifier,
		},'green');

		// build and connect lessons to courses. add id attribute
		for (let j = 0; j < courseData[i].lessons.length; j++) {
			assembleChildNode(
				lessonNodes,
				courseNode,
				courseData[i].lessons[j].identifier,
				courseData[i].lessons[j].title
			);
		}
	}

	// loop through course nodes
	for (let i = 0; i < courseNodes.length; i++) {
		// loop through userNodes
		for (let j = 0; j < userNodes.length; j++) {
			// if the course identifier is included in the users courses, connect that user node to that course node
			if (
				userNodes[j].coursesIdentifiers.includes(
					courseNodes[i].identifier
				)
			) {
				connectMainNodes(userNodes[j], courseNodes[i]);
			}
		}
	}

	return { nodes: [...courseNodes, ...lessonNodes, ...userNodes], links };
}

export default useForce;
