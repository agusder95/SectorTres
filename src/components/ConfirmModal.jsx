import { motion, AnimatePresence } from 'framer-motion'

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  return (
      <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              {/* Backdrop - Ahora es un hijo absoluto del contenedor flex */}
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={onClose}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />

              {/* Modal - Ahora es relativo para que el flex lo centre automáticamente */}
              <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: 'spring', duration: 0.3, bounce: 0.4 }}
                  className="relative w-full max-w-sm z-[101]" // Quitamos el fixed y los translates
              >
                <div className="bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-zinc-800">
                  {/* Warning Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-6 h-6 text-red-500"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {title}
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      {message}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-3 rounded-xl bg-f1-red text-white font-medium hover:bg-red-600 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
        )}
      </AnimatePresence>
  )
}