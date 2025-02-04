export default function TermsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold">Terms of Service</h1>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Acceptable Use</h2>
        <p className="text-gray-600 mb-4">
          By using SmoothOp, you agree to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>Provide accurate information for job applications</li>
          <li>Not engage in automated scraping of job listings</li>
          <li>Comply with all platform terms where you apply</li>
        </ul>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Service Limitations</h2>
        <p className="text-gray-600">
          While we optimize applications, we cannot guarantee job offers.
          Application outcomes depend on many factors beyond our control.
        </p>
      </section>
    </div>
  );
} 