import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { scrollToSection } from "@/lib/scrollToSection";
import { 
  Users, 
  Banknote, 
  CalendarDays, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Menu,
  X,
  Mail,
  MapPin,
  Phone,
  CheckCircle2,
} from "lucide-react";
import logo from "@/assets/logo.png";

const NAV_LINKS = [
  { label: "Features", id: "features" },
  { label: "Why Us", id: "about" },
  { label: "Contact", id: "contact" },
] as const;

function NavLink({
  sectionId,
  label,
  onNavigate,
  className,
}: {
  sectionId: string;
  label: string;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <a
      href={`#${sectionId}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        scrollToSection(sectionId);
        onNavigate?.();
      }}
    >
      {label}
    </a>
  );
}

export default function Landing() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && NAV_LINKS.some((link) => link.id === hash)) {
      requestAnimationFrame(() => scrollToSection(hash));
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col transition-colors">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <a
              href="#"
              className="flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                window.history.replaceState(null, "", "/");
              }}
            >
              <img 
                src={logo} 
                alt="HR Portal Logo" 
                className="h-12 w-12 object-contain"
              />
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">HR Portal</span>
            </a>
            
            <div className="hidden md:flex space-x-8 items-center">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.id}
                  sectionId={link.id}
                  label={link.label}
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                />
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle className="text-slate-600 dark:text-slate-300" />

              {user ? (
                <>
                  <Link to="/dashboard" className="hidden sm:block">
                    <Button variant="outline" className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-full px-6 shadow-sm transition-all">
                      Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button onClick={() => signOut()} variant="ghost" className="hidden sm:inline-flex text-slate-600 dark:text-slate-300 hover:text-red-600 rounded-full px-4">
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/auth" className="hidden sm:block">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all">
                    Login / Register
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-slate-600 dark:text-slate-300"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200 dark:border-slate-800 py-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.id}
                  sectionId={link.id}
                  label={link.label}
                  onNavigate={() => setMobileMenuOpen(false)}
                  className="block px-2 py-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                />
              ))}
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Button onClick={() => { signOut(); setMobileMenuOpen(false); }} variant="ghost" className="w-full text-red-600">
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Login / Register
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 overflow-hidden relative flex-grow">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl opacity-60 mix-blend-multiply dark:mix-blend-normal animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl opacity-60 mix-blend-multiply dark:mix-blend-normal animate-blob [animation-delay:2s]"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl opacity-60 mix-blend-multiply dark:mix-blend-normal animate-blob [animation-delay:4s]"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-medium text-sm mb-8 border border-blue-100 dark:border-blue-900 shadow-sm transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-3 duration-500">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            Modernize your workforce management
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            The Complete Platform for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">HR Excellence</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
            Streamline employee management, payroll, tracking, and performance all in one unified, intelligent workspace designed for modern forward-thinking teams.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            {user ? (
               <>
                 <Link to="/dashboard">
                   <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-blue-500/25 transition-all">
                     Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                   </Button>
                 </Link>
                 <Button onClick={() => signOut()} size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-slate-300 dark:border-slate-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-700 dark:text-slate-200 hover:text-red-600 transition-all bg-white dark:bg-slate-900 shadow-sm">
                   Logout
                 </Button>
               </>
             ) : (
              <Link to="/auth">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-blue-500/25 transition-all">
                  Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg rounded-full border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all bg-white dark:bg-slate-900 shadow-sm"
              onClick={() => scrollToSection("features")}
            >
              Explore Features
            </Button>
          </div>
          
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-slate-200 dark:border-slate-800 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
             <div className="flex flex-col items-center">
               <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">99.9%</div>
               <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Uptime</div>
             </div>
             <div className="flex flex-col items-center">
               <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">10k+</div>
               <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Companies</div>
             </div>
             <div className="flex flex-col items-center">
               <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">1M+</div>
               <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Employees Managed</div>
             </div>
             <div className="flex flex-col items-center">
               <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">24/7</div>
               <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Support</div>
             </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="scroll-mt-20 py-24 bg-white dark:bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Everything you need to manage your team</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Powerful tools designed to simplify your human resources workflow, from recruitment to retirement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:border-blue-100 dark:hover:border-blue-900 transition-all hover:-translate-y-2 duration-300 group">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Employee Database</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Centralize all employee records, documents, and historical data in one secure, easily accessible platform.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:border-emerald-100 dark:hover:border-emerald-900 transition-all hover:-translate-y-2 duration-300 group">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Banknote className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Automated Payroll</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Run payroll accurately and on time with automated calculations, tax deductions, and direct deposits.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:border-purple-100 dark:hover:border-purple-900 transition-all hover:-translate-y-2 duration-300 group">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <CalendarDays className="h-7 w-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Time & Attendance</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Track employee hours, manage leave requests, and monitor attendance patterns with intuitive tools.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:border-amber-100 dark:hover:border-amber-900 transition-all hover:-translate-y-2 duration-300 group">
              <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-7 w-7 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Performance Reviews</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Set goals, conduct appraisals, and track employee growth with customizable review cycles and templates.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:border-rose-100 dark:hover:border-rose-900 transition-all hover:-translate-y-2 duration-300 group">
              <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="h-7 w-7 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Compliance & Security</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Rest easy knowing your organizational data is protected with enterprise-grade security and compliance tools.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:border-indigo-100 dark:hover:border-indigo-900 transition-all hover:-translate-y-2 duration-300 group">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Fast & Scalable</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Built on modern architecture, our platform scales effortlessly from small teams to large enterprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="about" className="scroll-mt-20 py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Why teams choose HR Portal</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              We combine powerful HR tools with an intuitive experience so your team can focus on people, not paperwork.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                "All-in-one platform — employees, payroll, leave, and performance in a single workspace",
                "Role-based access — secure permissions for admins, HR, trainers, and staff",
                "Real-time insights — dashboards and reports to make data-driven HR decisions",
                "Built for growth — from startups to enterprises with thousands of employees",
              ].map((text) => (
                <div key={text} className="flex gap-4 items-start">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-lg">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">50%</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Less admin time</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">3x</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Faster onboarding</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">100%</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Cloud-based</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">24/7</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Expert support</div>
                </div>
              </div>
              <p className="text-center text-slate-600 dark:text-slate-400 mt-6 text-sm">
                Trusted by HR teams worldwide to simplify workforce management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-20 py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Get in touch</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Have questions? Our team is here to help you get started with HR Portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <a
              href="mailto:support@hrportal.com"
              className="flex flex-col items-center text-center p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg transition-all group"
            >
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Email us</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">support@hrportal.com</p>
            </a>

            <a
              href="tel:+18005551234"
              className="flex flex-col items-center text-center p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-lg transition-all group"
            >
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Phone className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Call us</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">+1 (800) 555-1234</p>
            </a>

            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="h-7 w-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Visit us</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">123 Business Ave, Suite 100<br />San Francisco, CA 94105</p>
            </div>
          </div>

          <div className="text-center mt-12">
            {!user && (
              <Link to="/auth">
                <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8">
                  Start your free trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-16 text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-slate-800 pb-12">
             <div className="col-span-1 md:col-span-1">
                <div className="flex items-center gap-2 mb-6">
                  <img 
                    src={logo} 
                    alt="HR Portal Logo" 
                    className="h-12 w-12 object-contain"
                  />
                  <span className="text-2xl font-bold text-white tracking-tight">HR Portal</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-400 mb-6">
                  Modernizing workspace management for teams that want to do more, together.
                </p>
             </div>
             
             <div>
                <h4 className="text-white font-semibold mb-6">Product</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <button type="button" onClick={() => scrollToSection("features")} className="hover:text-white transition-colors text-left">
                      Features
                    </button>
                  </li>
                  <li><Link to="/info/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link to="/info/security" className="hover:text-white transition-colors">Security</Link></li>
                  <li><Link to="/info/updates" className="hover:text-white transition-colors">Updates</Link></li>
                </ul>
             </div>

             <div>
                <h4 className="text-white font-semibold mb-6">Company</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <button type="button" onClick={() => scrollToSection("about")} className="hover:text-white transition-colors text-left">
                      About Us
                    </button>
                  </li>
                  <li><Link to="/info/careers" className="hover:text-white transition-colors">Careers</Link></li>
                  <li><Link to="/info/blog" className="hover:text-white transition-colors">Blog</Link></li>
                  <li>
                    <button type="button" onClick={() => scrollToSection("contact")} className="hover:text-white transition-colors text-left">
                      Contact
                    </button>
                  </li>
                </ul>
             </div>

             <div>
                <h4 className="text-white font-semibold mb-6">Legal</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link to="/info/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link to="/info/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/info/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                </ul>
             </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
             <p>&copy; {new Date().getFullYear()} HR Portal Inc. All rights reserved.</p>
             <div className="flex items-center gap-2 mt-4 md:mt-0">
               <Globe className="h-4 w-4" />
               <span>English (US)</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
