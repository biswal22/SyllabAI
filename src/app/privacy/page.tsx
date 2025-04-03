export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-3">Data Collection and Usage</h2>
          <p>
            SyllabAI is committed to protecting your privacy. Our application processes syllabuses locally 
            and does not store any syllabus content or personal information on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Syllabus Processing</h2>
          <p>
            When you upload a syllabus, the content is temporarily processed using OpenAI's API to extract 
            relevant information. The processing is done in real-time, and no content is retained after 
            the processing is complete. The extracted information is immediately returned to your browser 
            and is not stored on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Third-Party Services</h2>
          <p>
            We use OpenAI's API to process syllabus content. While we do not store your data, the 
            processing occurs through OpenAI's servers. We encourage you to review 
            <a 
              href="https://openai.com/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800"
            > OpenAI's privacy policy </a>
            for more information about their data handling practices.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Data Security</h2>
          <p>
            All data transmission between your browser and our services is encrypted using industry-standard 
            SSL/TLS protocols. Since we don't store any user data, there is no risk of data breaches 
            affecting your syllabus content.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
          <p>
            If you have any questions about our privacy practices, please contact us at{' '}
            <a 
              href="mailto:syllabai.help@gmail.com"
              className="text-indigo-600 hover:text-indigo-800"
            >
              syllabai.help@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Updates to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Any changes will be posted on this page.
          </p>
        </section>
      </div>
    </div>
  );
} 