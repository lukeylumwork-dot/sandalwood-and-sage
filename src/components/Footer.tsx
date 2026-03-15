const Footer = () => (
  <footer className="border-t mt-8">
    <div className="mx-auto max-w-4xl px-5 py-8 flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <p>© {new Date().getFullYear()} Sandalwood & Sage. All rights reserved.</p>
      <div className="flex gap-4">
        <a href="mailto:hello@sandalwoodandsage.fm" className="hover:text-foreground transition-colors">
          hello@sandalwoodandsage.fm
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;