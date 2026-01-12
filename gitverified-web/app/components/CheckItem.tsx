export default function CheckItem({ status, label }: { status: 'pass' | 'running' | 'pending' | 'failed', label: string }) {
   return (
      <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5 transition-colors">
         {status === 'pass' && <div className="text-green-500">✓</div>}
         {status === 'failed' && <div className="text-red-500">✗</div>}
         {status === 'running' && <div className="w-3 h-3 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>}
         {status === 'pending' && <div className="w-1.5 h-1.5 rounded-full bg-gray-700 ml-1"></div>}
         
         <span className={`text-xs ${status === 'running' ? 'text-white' : 'text-gray-500'} font-mono`}>{label}</span>
      </div>
   )
}
