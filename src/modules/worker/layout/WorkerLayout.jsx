import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import WorkerFooter from "./WorkerFooter";
import { getWorkerProfileAPI } from "../../../api/worker/workerAPI";

const WorkerLayout = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getWorkerProfileAPI();

        if (res.status === 200) {
          setProfile(res.data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header profile={profile} />

      <main className="flex-1">
        <Outlet context={{ profile, setProfile }} />
      </main>

      <WorkerFooter />
    </div>
  );
};

export default WorkerLayout;
