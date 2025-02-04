export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold">About SmoothOp</h1>
      
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-600">
          SmoothOp automates the job application process using AI, helping candidates save time
          and increase their interview success rate. We integrate with 50+ job platforms
          to streamline your job search.
        </p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-600">
          <li>Smart form autofill using your profile data</li>
          <li>AI-powered answer suggestions</li>
          <li>Real-time application tracking</li>
          <li>Resume optimization tools</li>
          <li>Cross-platform synchronization</li>
        </ul>
      </section>
    </div>
  );
} 