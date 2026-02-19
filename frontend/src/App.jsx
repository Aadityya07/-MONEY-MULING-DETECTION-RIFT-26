import { motion } from 'framer-motion'

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-background-card border border-border p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-3xl font-bold text-accent-clean underline">
          System Online
        </h1>
        <p className="text-text-secondary mt-2 font-mono">
          Tailwind v4 + Framer Motion initialized.
        </p>
      </motion.div>
    </div>
  )
}

export default App