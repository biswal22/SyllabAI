export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-3">Acceptance of Terms</h2>
          <p>
            By accessing or using SyllabAI, you agree to be bound by these Terms of Service and all applicable 
            laws and regulations. If you do not agree with any of these terms, you are prohibited from using 
            or accessing this site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Service Description</h2>
          <p>
            SyllabAI provides a tool for combining and analyzing course syllabuses. The service is 
            provided "as is" and "as available" without any warranties of any kind.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Use License</h2>
          <p>
            Permission is granted to temporarily use SyllabAI for personal, non-commercial transitory viewing only. 
            This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc ml-8 mt-2 space-y-1">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software contained on SyllabAI&apos;s website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Limitations</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>The service is intended for educational use only</li>
            <li>You may not use the service for any illegal purpose</li>
            <li>You may not use the service to process sensitive or confidential information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Disclaimer</h2>
          <p>
            The service is provided without any guarantees or warranties. We are not responsible for 
            any errors or inaccuracies in the processed content.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Fair Usage</h2>
          <p>
            To ensure service availability for all users, we reserve the right to implement usage limits 
            or restrict access in cases of excessive use.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Modifications to Service</h2>
          <p>
            We reserve the right to modify or discontinue the service at any time without notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Contact</h2>
          <p>
            Questions about the Terms of Service should be sent to{' '}
            <a 
              href="mailto:syllabai.help@gmail.com"
              className="text-indigo-600 hover:text-indigo-800"
            >
              syllabai.help@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
} 