import iconB from "../assets/iconB.png"
import iconW from "../assets/iconW.png"
import {useLocalStorage} from "../hooks/useLocalStorage.js";
export default function Header() {
    const [settings] = useLocalStorage('f1-settings',{
        theme: 'dark',
        use12:false,
    })
    const isDark = settings.theme === 'dark'
  return (
    <header className=" top-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-f1-dark backdrop-blur-md border-b border-zinc-800 h-[5.5rem] flex items-center justify-center">

            <img src={isDark ? iconB : iconW} alt="SectorTres Logo" className="w-[5rem] h-[5rem] mr-1" />
            <h1 className="text-xl font-bold flex items-center gap-2">
                <span className="text-gray-900 dark:text-white">SectorTres</span>
            </h1>

    </header>
  )
}