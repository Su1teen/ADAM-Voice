// This component is deprecated - use ChatMessage.tsx instead
// Keeping for backward compatibility

import { Cpu, User } from 'react-feather'

export default function ({ conversationItem }: { conversationItem: { role: string; formatted: { transcript: string } } }) {
  return (
    <div className="flex flex-row items-start gap-x-2 sm:gap-x-3 flex-wrap max-w-full">
      <div className="rounded border border-[var(--border)] p-1.5 sm:p-2 max-w-max flex-shrink-0 bg-[var(--bg-tertiary)]">
        {conversationItem.role === 'user' ? 
          <User size={16} className="sm:w-5 sm:h-5 text-[var(--fg-secondary)]" /> : 
          <Cpu size={16} className="sm:w-5 sm:h-5 text-[var(--fg-secondary)]" />
        }
      </div>
      <div className="flex flex-col gap-y-2 flex-1 min-w-0">
        <div className="text-sm sm:text-base break-words text-[var(--fg)]">{conversationItem.formatted.transcript}</div>
      </div>
    </div>
  )
}
