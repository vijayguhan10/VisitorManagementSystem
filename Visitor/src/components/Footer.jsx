function Footer() {
  return (
    <footer className="bg-white py-6 border-t border-neutral-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Visitor Management System
          </p>
          {/* Developed By Section */}
          <p className="text-sm text-neutral-500">
            Developed by <span className="font-semibold">CSE Department</span> - <span className="font-semibold">Vijay Guhan, Sabari</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
