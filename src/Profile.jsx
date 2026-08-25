import { useEffect, useState } from "react";

import Header from "./Header";
import Footer from "./Footer";
import useravatar from "./useravatar.png";

export default function Profile() {

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    loadProfile();
  }, []);


  const loadProfile = async () => {

    try {

      const response = await fetch(
        "http://localhost:9090/api/users/profile",
        {
          method: "GET",
          credentials: "include"
        }
      );


      console.log(
        "Profile status:",
        response.status
      );


      if (!response.ok) {

        const errorData =
          await response.json().catch(() => ({}));

        throw new Error(
          errorData.error ||
          "Unable to load profile"
        );
      }


      const data =
        await response.json();


      console.log(
        "Profile API response:",
        data
      );


      setProfile(data);


      // Keep localStorage synchronized
      if (data.username) {
        localStorage.setItem(
          "username",
          data.username
        );
      }

      if (data.role) {
        localStorage.setItem(
          "role",
          data.role
        );
      }


    } catch (error) {

      console.error(
        "Profile error:",
        error
      );

      setError(
        error.message ||
        "Unable to load profile"
      );

    } finally {

      setLoading(false);
    }
  };


  if (loading) {

    return (
      <>
        <Header />

        <div
          style={{
            textAlign: "center",
            marginTop: "100px"
          }}
        >
          <h2>Loading profile...</h2>
        </div>

        <Footer />
      </>
    );
  }


  if (error) {

    return (
      <>
        <Header />

        <div
          style={{
            width: "400px",
            margin: "80px auto",
            textAlign: "center",
            padding: "30px",
            boxShadow: "0 0 10px #ccc",
            borderRadius: "10px"
          }}
        >
          <h2>Profile Error</h2>

          <p
            style={{
              color: "red"
            }}
          >
            {error}
          </p>

          <button
            onClick={loadProfile}
            style={{
              padding: "10px 20px",
              cursor: "pointer"
            }}
          >
            Try Again
          </button>
        </div>

        <Footer />
      </>
    );
  }


  return (
    <>
      <Header />

      <div
        style={{
          width: "400px",
          margin: "50px auto",
          textAlign: "center",
          padding: "30px",
          boxShadow: "0 0 10px #ccc",
          borderRadius: "10px",
          backgroundColor: "#fff"
        }}
      >

        <img
          src={useravatar}
          alt="User"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover"
          }}
        />


        <h2>
          {profile?.username || "User"}
        </h2>


        <p>
          <strong>Email:</strong>{" "}
          {profile?.email || "Not available"}
        </p>


        <p>
          <strong>Role:</strong>{" "}
          {profile?.role || "Not available"}
        </p>

      </div>

      <Footer />
    </>
  );
}