import logoDark from "@/assets/logo-dark.svg";
import logoLight from "@/assets/logo-light.svg";

const Footer = () => (
  <footer className="border-t mt-8">
    <div className="mx-auto max-w-4xl px-5 py-8 flex flex-col gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <img src={logoDark} alt="Sandalwood & Sage" className="h-8 w-auto block dark:hidden" />
        <img src={logoLight} alt="Sandalwood & Sage" className="h-8 w-auto hidden dark:block" />
        <p>© {new Date().getFullYear()} All rights reserved.</p>
      </div>
      <div className="flex gap-4">
        <a href="mailto:hello@sandalwoodandsage.fm" className="hover:text-foreground transition-colors">
          hello@sandalwoodandsage.fm
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
