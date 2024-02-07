import axios from "axios";

export default axios.create({
	baseURL: "http://localhost:8080", // local spring boot
	baseURL: "http://localhost:5000", // local node
	// baseURL: "http://18.144.53.10:8080", // to point to ec2 spring boot. Should change to elastic ip.
	// baseURL: "http://18.144.53.10:5000", // to point to ec2 node. Should change to elastic ip.
	headers: { "Content-Type": "application/json" },
	withCredentials: true,
});
