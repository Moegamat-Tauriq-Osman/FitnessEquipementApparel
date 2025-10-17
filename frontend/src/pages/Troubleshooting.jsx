// src/pages/Troubleshooting.js
import React from 'react';
import { Link } from 'react-router-dom';

const Troubleshooting = () => {
  const commonIssues = [
    {
      category: "Account & Login",
      issues: [
        {
          question: "I can't log into my account",
          solution: [
            "Ensure you're using the correct email address",
            "Clear your browser cache and cookies",
            "Try using a different browser or incognito mode"
          ]
        },
        {
          question: "My account is locked",
          solution: [
            "Wait 30 minutes and try again",
            "Contact IT support if the issue persists"
          ]
        }
      ]
    },
    {
      category: "Orders & Payments",
      issues: [
        {
          question: "My payment was declined",
          solution: [
            "Verify that your card details are correct",
            "Ensure you have sufficient funds",
            "Contact your bank to check for any restrictions",
            "Try a different payment method"
          ]
        },
        {
          question: "I didn't receive my order confirmation",
          solution: [
            "Check your order history in 'My Orders'",
            "Contact customer support with your order details"
          ]
        },
        {
          question: "I can't cancel my order",
          solution: [
            "Go to 'My Orders' and check if cancellation is available",
            "Orders can only be cancelled if the status of your order is pending or processing.",
            "Contact customer support"
          ]
        }
      ]
    },
    {
      category: "Technical Issues",
      issues: [
        {
          question: "The website is not loading properly",
          solution: [
            "Clear your browser cache and cookies",
            "Try refreshing the page",
            "Use a different web browser",
            "Check your internet connection",
            "Disable browser extensions temporarily"
          ]
        },
        {
          question: "Images are not displaying",
          solution: [
            "Check your internet connection speed",
            "Clear browser cache",
            "Disable ad blockers for this site",
            "Try accessing from a different device"
          ]
        },
        {
          question: "The page keeps crashing or freezing",
          solution: [
            "Close other tabs and applications",
            "Update your browser to the latest version",
            "Restart your device",
            "Try using a different device"
          ]
        }
      ]
    },
    {
      category: "Product & Shopping",
      issues: [
        {
          question: "I can't add items to my cart",
          solution: [
            "Ensure the product is in stock",
            "Clear your browser cache",
            "Try using a different browser"
          ]
        },
         
        {
          question: "I can't find a specific product",
          solution: [
            "Use the search function with different keywords",
            "Browse through relevant categories",
            "Contact customer support for assistance"
          ]
        }
      ]
    }
  ];

const quickFixes = [
  { title: "Clear Browser Cache" },
  { title: "Check Internet Connection" },
  { title: "Update Your Browser" }
];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <nav className="mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-500">Troubleshooting</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Troubleshooting Guide</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
           Find your issue below and follow the step-by-step solutions.
          </p>
        </div>

        {/* Quick Fixes Section */}
        <div className="mb-12">
  <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Fixes</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {quickFixes.map((fix, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-blue-600">{fix.title}</h3>
      </div>
    ))}
  </div>
</div>

        {/* Common Issues Section */}
        <div className="space-y-8">
          {commonIssues.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">{category.category}</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {category.issues.map((issue, issueIndex) => (
                    <div key={issueIndex} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">{issue.question}</h3>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-blue-800 mb-2">Solution:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {issue.solution.map((step, stepIndex) => (
                            <li key={stepIndex} className="text-sm">{step}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8 text-center">
          <div className=" flex items-center justify-center mx-auto mb-6">
            
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            If you couldn't find a solution to your problem, our support team is ready to help you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/support"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </Link>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default Troubleshooting;