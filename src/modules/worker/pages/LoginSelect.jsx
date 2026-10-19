import React, { useState } from "react";
import { User, UserCog, Building2, CheckCircle2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LoginSelect = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: "worker",
      title: "Worker",
      description: "Find jobs, manage shifts, and get paid instantly.",
      icon: User,
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "hover:border-green-300",
    },
    {
      id: "agent",
      title: "Agent",
      description: "Manage workers, assign tasks, and oversee operations.",
      icon: UserCog,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      borderColor: "hover:border-orange-300",
    },
    {
      id: "company",
      title: "Company",
      description: "Post jobs, hire talent, and build your workforce.",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "hover:border-blue-300",
    },
  ];

  const handleRoleClick = (roleId) => {
    setSelectedRole(roleId);
    let redirectPath = "";
    switch (roleId) {
      case "worker":
        redirectPath = "/login";
        break;
      case "company":
        redirectPath = "/company/login";
        break;
      case "agent":
        redirectPath = "/agent/login";
        break;
      default:
        redirectPath = "/login";
    }
    window.location.href = redirectPath;
  };

  return (
    <>
      <Header />

      <div className="min-h-full bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome Back
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Please select your role to continue. Choose the account type that
              matches your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;

              return (
                <div
                  key={role.id}
                  onClick={() => handleRoleClick(role.id)}
                  className={`
                    relative bg-white rounded-2xl shadow-lg p-6 cursor-pointer
                    transition-all duration-200 border-2
                    ${
                      isSelected
                        ? "border-orange-500 shadow-xl"
                        : "border-transparent hover:shadow-xl " +
                          role.borderColor
                    }
                  `}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 className="w-6 h-6 text-orange-500" />
                    </div>
                  )}

                  <div
                    className={`${role.bgColor} w-16 h-16 rounded-full flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-8 h-8 ${role.color}`} />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {role.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {role.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default LoginSelect;
