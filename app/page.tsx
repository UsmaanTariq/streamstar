import { getSpotifyToken } from "@/services/spotifyApi";
import UpdateStreamsButton from './components/UpdateStreamsButton'
import Navbar from "./components/navbar";

export default function Home() {
  let token = getSpotifyToken()
  console.log(token)
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-30"></div>
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-30"></div>
        </div>

        {/* Navigation */}
        <Navbar />
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm mb-8">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span className="text-sm text-gray-700 font-medium">Track Your Producer Impact</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your Beats,<br/>
              <span className="text-gray-600">
                Your Streams,
              </span><br/>
              Your Story
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Ever wondered how many streams your productions have generated? 
              Enter your catalog and discover your total impact across all platforms.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-md">
                Get Started Free
              </button>
              <button className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-md">
                Watch Demo
              </button>
            </div>
          </div>
        </div>

        {/* Features Section - Black Background Starts */}
        <div className="bg-black pt-16 pb-16">
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Track Your Productions</h3>
              <p className="text-gray-600 leading-relaxed">
                Easily add all the songs you've produced. Build your complete production catalog in minutes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Calculate Total Streams</h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant insights into your total stream count across all your productions and platforms.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Share Your Success</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate beautiful stats cards to showcase your impact. Perfect for social media and portfolios.
              </p>
            </div>
          </div>
          </div>

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto px-6 pt-16 pb-20 lg:px-8">
            <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-12 text-center shadow-xl">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Ready to see your impact?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of producers tracking their streaming success
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-md">
                  Start Tracking Now
                </button>
                <UpdateStreamsButton/>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
