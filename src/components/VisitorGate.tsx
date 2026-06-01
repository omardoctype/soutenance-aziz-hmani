import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'

interface VisitorGateProps {
  onSubmitName: (name: string) => void
}

export const VisitorGate = ({ onSubmitName }: VisitorGateProps) => {
  const [name, setName] = useState('')
  const normalizedDraftName = name.trim()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedName = normalizedDraftName

    if (normalizedName.length === 0) {
      return
    }

    onSubmitName(normalizedName)
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-x-hidden px-3 py-7">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-8rem] top-[-6rem] h-56 w-56 rounded-full bg-gold-500/15 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[-8rem] h-64 w-64 rounded-full bg-navy-900/12 blur-3xl" />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 14, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-[calc(100%-12px)] max-w-md rounded-[1.9rem] border border-slate-200/75 bg-white/96 p-5 shadow-[0_28px_70px_rgba(7,27,58,0.15)] sm:p-6"
      >
        <h1 className="font-display text-[clamp(1.7rem,7vw,2.4rem)] leading-tight text-navy-900">
          Bienvenue à la soutenance de Aziz Hmani
        </h1>

        <form
          className="mt-6 space-y-3"
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="visitor-name"
            className="block text-sm font-semibold text-navy-900"
          >
            Votre nom
          </label>

          <input
            id="visitor-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex: Omar"
            autoComplete="name"
            className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-navy-800"
          />

          <button
            type="submit"
            disabled={name.trim().length === 0}
            className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-navy-900 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(16,40,70,0.22)] transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            Entrer
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </motion.section>
    </div>
  )
}
