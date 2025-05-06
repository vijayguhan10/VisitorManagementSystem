import { useState } from 'react'
import VisitorForm from './components/VisitorForm'
import Header from './components/Header'
import Footer from './components/Footer'
import PhoneAuth from './components/PhoneAuth'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userPhone, setUserPhone] = useState(null)
  const [submissions, setSubmissions] = useState([])
  
  const handleAuthSuccess = (phoneNumber) => {
    setIsAuthenticated(true)
    setUserPhone(phoneNumber)
  }
  
  const handleSubmission = (visitorData) => {
    setSubmissions([visitorData, ...submissions])
  }
  
  if (!isAuthenticated) {
    return <PhoneAuth onAuthSuccess={handleAuthSuccess} />
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header userPhone={userPhone} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <VisitorForm onSubmitSuccess={handleSubmission} />
          
          {submissions.length > 0 && (
            <div className="mt-12 animate-fade-in">
              <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Recent Submissions</h2>
              <div className="space-y-4">
                {submissions.map((submission, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      {submission.photo && (
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={submission.photo} 
                            alt={`${submission.visitorName}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-grow">
                        <h3 className="font-medium text-lg text-neutral-800">{submission.visitorName}</h3>
                        <p className="text-sm text-neutral-500">{submission.phoneNumber}</p>
                        <p className="text-sm text-neutral-600 mt-1">
                          <span className="font-medium">Reason:</span> {submission.reason}
                        </p>
                        <p className="text-sm text-neutral-600">
                          <span className="font-medium">In Time:</span> {new Date(submission.inTime).toLocaleString()}
                        </p>
                        {submission.companions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-neutral-600">Companions:</p>
                            <div className="mt-1 space-y-1">
                              {submission.companions.map((companion, idx) => (
                                <p key={idx} className="text-sm text-neutral-600">
                                  {companion.name} ({companion.phoneNumber})
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                        <p className="text-xs text-neutral-400 mt-2">
                          {new Date(submission.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App