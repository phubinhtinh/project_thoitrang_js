import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full mt-24 bg-stone-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full px-8 md:px-12 py-12 md:py-16 border-t border-stone-200/50">
        <div className="mb-8 md:mb-0">
          <Link to="/" className="font-headline text-lg tracking-widest text-neutral-800">
            ATELIER
          </Link>
          <p className="font-body text-[11px] uppercase tracking-[0.15em] text-neutral-600 mt-3">
            © 2024 THE DIGITAL ATELIER. ALL RIGHTS RESERVED.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 md:gap-8 mb-8 md:mb-0">
          <a href="#" className="font-body text-[11px] uppercase tracking-[0.15em] text-neutral-500 hover:text-neutral-900 transition-colors duration-300">
            Privacy Policy
          </a>
          <a href="#" className="font-body text-[11px] uppercase tracking-[0.15em] text-neutral-500 hover:text-neutral-900 transition-colors duration-300">
            Terms of Service
          </a>
          <a href="#" className="font-body text-[11px] uppercase tracking-[0.15em] text-neutral-500 hover:text-neutral-900 transition-colors duration-300 font-bold text-neutral-900">
            Sustainability
          </a>
          <a href="#" className="font-body text-[11px] uppercase tracking-[0.15em] text-neutral-500 hover:text-neutral-900 transition-colors duration-300">
            Contact
          </a>
        </div>

        <div className="flex space-x-5">
          <a href="#" className="text-neutral-500 hover:text-neutral-900 transition-colors">
            <span className="material-symbols-outlined">public</span>
          </a>
          <a href="#" className="text-neutral-500 hover:text-neutral-900 transition-colors">
            <span className="material-symbols-outlined">alternate_email</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
