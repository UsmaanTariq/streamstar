import { getSpotifyToken } from "@/services/spotifyApi";
import UpdateStreamsButton from './components/UpdateStreamsButton'

export default function Home() {
  let token = getSpotifyToken()
  console.log(token)
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 px-6 py-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800">
                <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">ProducerWrapped</span>
            </div>
            <button className="px-6 py-2.5 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors font-medium">
              Sign In
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full border border-zinc-800 mb-8">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              <span className="text-sm text-zinc-400">Track Your Producer Impact</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Your Beats,<br/>
              <span className="text-zinc-400">
                Your Streams,
              </span><br/>
              Your Story
            </h1>
            
            <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Ever wondered how many streams your productions have generated? 
              Enter your catalog and discover your total impact across all platforms.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-4 bg-white text-black rounded-lg font-semibold text-lg hover:bg-zinc-200 transition-colors">
                Get Started Free
              </button>
              <button className="px-8 py-4 bg-zinc-900 text-white rounded-lg font-semibold text-lg hover:bg-zinc-800 transition-colors border border-zinc-800">
                Watch Demo
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-32 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Track Your Productions</h3>
              <p className="text-zinc-400 leading-relaxed">
                Easily add all the songs you've produced. Build your complete production catalog in minutes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Calculate Total Streams</h3>
              <p className="text-zinc-400 leading-relaxed">
                Get instant insights into your total stream count across all your productions and platforms.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Share Your Success</h3>
              <p className="text-zinc-400 leading-relaxed">
                Generate beautiful stats cards to showcase your impact. Perfect for social media and portfolios.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-32 lg:px-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to see your impact?
            </h2>
            <p className="text-xl text-zinc-400 mb-8">
              Join thousands of producers tracking their streaming success
            </p>
            <button className="px-8 py-4 bg-white text-black rounded-lg font-semibold text-lg hover:bg-zinc-200 transition-colors">
              Start Tracking Now
            </button>
            <UpdateStreamsButton/>
          </div>
        </div>
      </main>
    </div>
  );
}
