import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import HeroImage from "../../images/School.jpg";
import { Link } from "react-router-dom";
import "./Home.css";
import Spinner from "../spinner/Spinner";
import Force from "../Force";

const Home = () => {
	const { auth, setAuth } = useAuth();

	const [isLoading, setIsLoading] = useState(false);

	const [courseData, setCourseData] = useState();
	const [usersData, setUsersData] = useState();

	const axiosPrivate = useAxiosPrivate();

	const fetchCourses = async () => {
		const response = await axiosPrivate.get("/api/v1/courses/");
		const cData = response.data;
		setCourseData(cData);
	};

	const fetchUsers = async () => {
		const response = await axiosPrivate.get("/api/v1/users/");
		const usersData = response.data;
		setUsersData(usersData);
	};

	useEffect(() => {
		if (auth?.user) {
			setIsLoading(true);
			try {
				fetchCourses();
				fetchUsers();
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		}
	}, []);
	return (
		<>
			<Spinner loadSpinner={isLoading} />
			<main className="container">
				{!auth?.user ? (
					<img src={HeroImage} alt="HeroImage" />
				) : courseData && usersData ? (
					<>
						<Force courseData={courseData} usersData={usersData} />
						{courseData.map((d) => {
							return (
								<div key={d.identifier} className="card mt-2">
									<div className="card-header-layout">
										<p className="card-header text-secondary bg-white">
											<span className="course-title">
												<Link
													to={`/Course/${d.identifier}`}
												>
													{d.title}
												</Link>
											</span>
										</p>
									</div>
									<div>
										<hr />
										{d.lessons.map((l) => {
											return (
												<div
													key={l.identifier}
													className="mt-2 text-center"
												>
													<h5 className="card-title mt-2">
														<span className="text-dark">
															{l.title}
														</span>
													</h5>
												</div>
											);
										})}
									</div>
									<hr />
								</div>
							);
						})}
					</>
				) : null}
			</main>
		</>
	);
};

export default Home;
