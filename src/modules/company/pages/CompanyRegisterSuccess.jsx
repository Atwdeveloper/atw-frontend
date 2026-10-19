import React, { useEffect } from 'react';
import { CheckCircle, Mail, Building, Shield, Copy, ArrowRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const CompanyRegisterSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, companyName, uniqueCode, isDemo } = location.state || {};

//   useEffect(() => {
//     if (!email || !companyName) {
//       navigate('/company/register');
//     }
//   }, [email, companyName, navigate]);

  const handleCopyCode = () => {
    if (uniqueCode) {
      navigator.clipboard.writeText(uniqueCode);
      toast.success('Unique code copied to clipboard!');
    }
  };

  const steps = [
    {
      title: 'Check Your Email',
      description: 'Look for an activation email from Company Portal',
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Activate Account',
      description: 'Click the activation link in the email',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Admin Approval',
      description: 'Wait for admin to approve your registration',
      icon: Building,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Start Using',
      description: 'Login and access your company dashboard',
      icon: ArrowRight,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  const demoEmailContent = `Subject: Activate Your Company Portal Account

Hello ${companyName},

Thank you for registering with Company Portal!

Your unique company code: ${uniqueCode}

To activate your account, please click the link below:
https://companyportal.com/activate/demo-token-${Date.now()}

This link will expire in 7 days.

If you didn't request this registration, please ignore this email.

Best regards,
Company Portal Team`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Registration Successful!
          </h1>
          <p className="text-xl text-gray-600">
            Your company registration has been submitted successfully
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Building className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{companyName}</h2>
                  <p className="text-gray-600">{email}</p>
                </div>
              </div>

              {/* Unique Code */}
              {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Your Unique Company Code</h3>
                    <p className="text-gray-600 text-sm">Save this code for future reference</p>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-blue-300">
                  <code className="text-2xl font-bold text-gray-800 tracking-wider">
                    {uniqueCode}
                  </code>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  This code will appear on your company profile and be used for admin identification.
                </p>
              </div> */}

              {/* Next Steps */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">What Happens Next?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className={`p-2 ${step.bgColor} rounded-lg`}>
                        <step.icon className={`w-6 h-6 ${step.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{step.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Email Preview (Demo Only) */}
            {isDemo && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Mail className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800">Demo Mode Active</h3>
                    <p className="text-yellow-700 text-sm">
                      In a real application, you would receive this email:
                    </p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-yellow-300 font-mono text-sm text-gray-700 whitespace-pre-line">
                  {demoEmailContent}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Important Notes */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Important Notes</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Check your spam folder if you don't see the email</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>The activation link expires in 7 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Admin approval typically takes 1-2 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Keep your unique code secure</span>
                </li>
              </ul>
            </div>

            {/* Support Card */}
            {/* <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-blue-800 mb-3">Need Help?</h3>
              <p className="text-sm text-blue-700 mb-4">
                Didn't receive the email? Contact our support team for assistance.
              </p>
              <div className="space-y-3">
                <a 
                  href="mailto:support@companyportal.com"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <Mail className="w-4 h-4" />
                  support@companyportal.com
                </a>
                <p className="text-xs text-blue-600">
                  Response time: Within 24 hours
                </p>
              </div>
            </div> */}

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link
                to="/company/login"
                className="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transition"
              >
                Go to Login
              </Link>
              <Link
                to="/company/register"
                className="block w-full py-3 px-4 bg-white border-2 border-gray-300 text-gray-700 text-center font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Register Another Company
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 pt-6 border-t border-gray-200">
          <p className="text-gray-600">
            Thank you for choosing Company Portal. We look forward to serving you!
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © {new Date().getFullYear()} Company Portal. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegisterSuccess;