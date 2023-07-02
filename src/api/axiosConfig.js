import axios from "axios";

export default axios.create({
	baseURL: "http://localhost:8080",
	// baseURL: "http://18.144.53.10:8080", // to point to ec2 spring boot. Should change to elastic ip.
	headers: { "Content-Type": "application/json" },
	withCredentials: true,
});
