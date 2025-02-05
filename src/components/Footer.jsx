export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} New World Alliance. All rights reserved.
        </div>
        <nav className="flex gap-4">
          <a href="/privacy" className="hover:text-blue-400">Privacy Policy</a>
          <a href="/terms" className="hover:text-blue-400">Terms &amp; Conditions</a>
        </nav>
      </div>
    </footer>
  )
}
