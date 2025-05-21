import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Users, Layers } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-purple-600" />
            <span>EventHub</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Manage Events with Ease</h1>
              <p className="text-xl mb-8">
                Create, manage, and join events all in one place. The perfect platform for organizers and attendees.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register?role=organizer">
                  <Button className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-6 w-full sm:w-auto">
                    Register as Organizer
                  </Button>
                </Link>
                <Link href="/register?role=attendee">
                  <Button className="bg-purple-700 hover:bg-purple-800 px-6 py-6 w-full sm:w-auto">
                    Register as Attendee
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Platform Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Event Management</h3>
                <p className="text-gray-600">
                  Create, edit and manage your events with an intuitive dashboard. Set capacity limits and track
                  registrations.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Attendee Registration</h3>
                <p className="text-gray-600">
                  Browse events, register with a single click, and receive organizer contact information instantly.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                  <Layers className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Activity Logging</h3>
                <p className="text-gray-600">
                  Track all event activities including registrations, updates, and creations through a comprehensive
                  logging system.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of organizers and attendees on our platform and experience seamless event management.
            </p>
            <Link href="/events">
              <Button className="px-8 py-6">
                Browse Events <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="text-xl font-bold flex items-center gap-2">
                <Calendar className="h-6 w-6 text-purple-400" />
                <span>EventHub</span>
              </Link>
              <p className="mt-2 text-gray-400">The ultimate event management platform</p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:gap-16">
              <div>
                <h3 className="text-lg font-semibold mb-4">Platform</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/events" className="text-gray-400 hover:text-white">
                      Events
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-gray-400 hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-gray-400 hover:text-white">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/terms" className="text-gray-400 hover:text-white">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-gray-400 hover:text-white">
                      Privacy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-6 text-center md:text-left text-gray-400">
            <p>© {new Date().getFullYear()} EventHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
