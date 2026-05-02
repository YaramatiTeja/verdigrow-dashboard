import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="container mx-auto grid gap-10 px-6 py-14 md:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground">Smart vertical farming, served fresh from your rooftop.</p>
        </div>
        {[
          { title: "Product", links: ["Features", "Dashboard", "Pricing", "Changelog"] },
          { title: "Company", links: ["About", "Customers", "Press", "Careers"] },
          { title: "Resources", links: ["Docs", "Guides", "API", "Support"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-semibold">{col.title}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {col.links.map((l) => (
                <li key={l}><a href="#" className="transition-colors hover:text-foreground">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-muted-foreground md:flex-row">
          <p>© 2026 VertiGrow OS. All rights reserved.</p>
          <p>Made with 🌿 for urban kitchens.</p>
        </div>
      </div>
    </footer>
  );
}
