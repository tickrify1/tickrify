import { Bot, Twitter, Youtube } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const footerLinks = {
    Plataforma: [
      { title: "Features", href: "#features" },
      { title: "Planos", href: "#pricing" },
    ],
    Empresa: [
      { title: "Sobre Nós", href: "#" },
    ],
  };

  return (
    <footer className="bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col space-y-4 md:col-span-1">
             <a href="/" className="flex items-center space-x-2">
                <Bot className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">Tickrify</span>
              </a>
              <p className="text-muted-foreground text-sm">
                Análise de Trading com IA.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary"><Twitter /></a>
                <a href="#" className="text-muted-foreground hover:text-primary"><Youtube /></a>
              </div>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold">{category}</h4>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.title}>
                    <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator className="my-8" />
        <div className="text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Tickrify. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
