import { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#313338] overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </div>
      </div>

      {/* Content */}
      <div className="relative w-full max-w-md p-6 mx-4">
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Team Connect</h1>
          <p className="text-[#B5BAC1] text-center">A modern collaboration platform</p>
        </div>
        <div className="bg-[#2B2D31] rounded-lg shadow-2xl border border-[#1E1F22]/50 backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  )
} 