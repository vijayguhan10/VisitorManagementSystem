import { useState, useEffect } from 'react'

function Header({ userPhone }) {
  const [scrolled, setScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [scrolled])
  
  return (
    <header 
      className={`sticky top-0 z-10 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div 
              className={`w-10 h-10 rounded-lg mr-3 flex items-center justify-center transition-colors ${
                scrolled ? 'bg-primary-500 text-white' : 'bg-primary-100 text-primary-600'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
              </svg>
            </div>
            <div>
              <h1 
                className={`text-xl font-semibold transition-colors ${
                  scrolled ? 'text-neutral-800' : 'text-primary-600'
                }`}
              >
                Visitor Management
              </h1>
              {userPhone && (
                <p className="text-sm text-neutral-500">
                  {userPhone}
                </p>
              )}
            </div>
          </div>
          <div>
            <span className="hidden sm:inline-block text-sm px-3 py-1 rounded-full bg-primary-50 text-primary-700 font-medium border border-primary-200">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header