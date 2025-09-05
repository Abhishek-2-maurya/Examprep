// import React, { useEffect, useState } from "react";
// import axios from "axios";
// // import {
// //   FaEnvelope,
// //   FaPhone,
// //   FaUser,
// //   FaCheck,
// //   FaTimes,
// //   FaFileAlt,
// //   FaStar,
// // } from "react-icons/fa";

// const Profile = () => {
//   const userId = localStorage.getItem("userId"); // Ensure this is set
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/examinee/profile/${userId}`
//         );
//         setUser(res.data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching profile:", err);
//         setError("Failed to load profile");
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [userId]);

//   if (loading) return <h2 style={{ color: "white" }}>Loading profile...</h2>;
//   if (error) return <h2 style={{ color: "red" }}>{error}</h2>;
//   if (!user) return null;

//   return (
//    <>
//    </>
//   );
// };

// export default Profile;
