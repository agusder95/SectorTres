import {Heart} from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-10 mt-10 border-t border-zinc-800 flex flex-col items-center justify-center">
        <ul>
            <li className="flex items-center justify-center text-sm font-medium text-gray-600 mb-2">
                <p className="text-gray-500 dark:text-zinc-600 text-sm">
                    Hecho con <Heart size={16} className="inline text-f1-red" /> por
                     <a
                        href="https://github.com/agusder95"
                        className={"text-f1-red hover:underline ml-1"}
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        @Agus De Robles
                     </a>
                </p>
            </li>
            <li className="flex items-center justify-center text-sm font-medium text-gray-600 mb-2">
                <p className="text-gray-500 dark:text-zinc-600 text-sm">

                Contacto:{' '}
                <a href="mailto:agustin.derobles1995@gmail.com" className="text-gray-400">
                    Contactame por mail!
                </a>
                </p>
            </li>
            <li className="flex items-center justify-center text-sm font-medium text-gray-600">
                <p className="text-gray-500 dark:text-zinc-600 text-sm">
                    SectorTres 2026
                </p>
            </li>

        </ul>

    </footer>
  )
}