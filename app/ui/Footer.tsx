import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-8 shadow-inner">
      <div className="container mx-auto px-4 text-center flex flex-col items-center gap-4">
        <div className="flex gap-6 mb-2">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="Twitter"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={24} />
          </a>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} <span className="font-semibold">Classcraft</span>. Todos los derechos reservados.
        </p>
        <p className="text-xs text-gray-400">
          Este es un proyecto educativo y no está afiliado con el Classcraft original.
        </p>
      </div>
    </footer>
  );
}