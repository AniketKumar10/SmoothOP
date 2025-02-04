export default function PrivacyPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Data Collection</h2>
        <p className="text-gray-600 mb-4">
          We only collect essential information required for job applications:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>Contact information you provide</li>
          <li>Job application history</li>
          <li>Resume and cover letter content</li>
        </ul>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
        <p className="text-gray-600">
          All data is encrypted both in transit and at rest. We never store your
          passwords or sensitive financial information.
        </p>
      </section>
    </div>
  );
} 