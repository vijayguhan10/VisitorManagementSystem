function Footer() {
  return (
    <footer className="bg-white py-6 border-t border-neutral-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Visitor Management System
          </p>
          <div className="flex items-center space-x-4">
            <a href="#privacy" className="text-sm text-neutral-500 hover:text-primary-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="text-sm text-neutral-500 hover:text-primary-600 transition-colors">
              Terms of Service
            </a>
            <a href="#help" className="text-sm text-neutral-500 hover:text-primary-600 transition-colors">
              Help Center
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer