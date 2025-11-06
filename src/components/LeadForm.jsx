

"use client";
import { useState, useEffect } from "react";
import { initPixel } from "../utils/pixel";

export default function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    initPixel();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });

    const ReactPixel = await initPixel();
    ReactPixel.track("Lead", { name, phone });
    alert("Lead Submitted Successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-5 border border-gray-200"
      >
        <h2 className="text-2xl font-semibold text-center text-blue-700">
          Get a Call Back
        </h2>

        <p className="text-center text-gray-600 text-sm">
          Fill the form and our team will contact you shortly.
        </p>

        <input
          className="border border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-lg w-full outline-none transition-all bg-white"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="border border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-lg w-full outline-none transition-all bg-white"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <button className="bg-blue-600 hover:bg-blue-700 transition-all text-white w-full p-3 rounded-lg shadow-md hover:shadow-lg">
          Submit Lead
        </button>
      </form>
    </div>
  );
}
