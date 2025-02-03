"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JobApplication {
  company: string;
  position: string;
  status: string;
}

export default function Dashboard() {
  const { user } = useUser();
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [newApplication, setNewApplication] = useState<JobApplication>({
    company: "",
    position: "",
    status: "Applied",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewApplication({ ...newApplication, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setJobApplications([...jobApplications, newApplication]);
    setNewApplication({ company: "", position: "", status: "Applied" });
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Welcome, {user.firstName}!</h1>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Add New Job Application</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              value={newApplication.company}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              name="position"
              value={newApplication.position}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={newApplication.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
          </div>
          <Button type="submit">Add Application</Button>
        </form>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Your Job Applications</h2>
        {jobApplications.length === 0 ? (
          <p>No job applications yet. Start by adding one above!</p>
        ) : (
          <ul className="space-y-4">
            {jobApplications.map((app, index) => (
              <li key={index} className="border-b pb-2">
                <h3 className="font-semibold">
                  {app.position} at {app.company}
                </h3>
                <p>Status: {app.status}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">AI-Powered Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button>Analyze Job Description</Button>
          <Button>Get Answer Suggestions</Button>
          <Button>Optimize Resume</Button>
        </div>
      </section>
    </div>
  );
}

