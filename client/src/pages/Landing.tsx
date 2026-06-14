import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { scrollToSection } from "@/lib/scrollToSection";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  Users, 
  Banknote, 
  CalendarDays, 
  TrendingUp, 
  ArrowRight,
  ArrowUp,
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

const FEATURES = [
  {
    title: "Employee Database",
    description: "Centralize all employee records, contracts, and documents in one secure, easily accessible cloud workspace.",
    icon: Users,
    color: "blue",
    details: ["Unified profiles", "Document sharing", "Custom fields"]
  },
  {
    title: "Automated Payroll",
    description: "Calculate salaries, tax deductions, bonuses, and deposits accurately and on time with automated batch processing.",
    icon: Banknote,
    color: "emerald",
    details: ["Automated processing", "Detailed payslips", "Tax calculations"]
  },
  {
    title: "Time & Attendance",
    description: "Track employee check-ins/outs, manage leave requests, and monitor attendance patterns with smart shift tables.",
    icon: CalendarDays,
    color: "purple",
    details: ["Shift calendars", "Leave approvals", "Real-time logs"]
  },
  {
    title: "Performance Reviews",
    description: "Set company goals, conduct feedback cycles, and track employee growth with custom assessment templates.",
    icon: TrendingUp,
    color: "amber",
    details: ["Goal tracking", "Self-appraisals", "Growth metrics"]
  },
  {
    title: "Compliance & Security",
    description: "Protect sensitive HR data with enterprise-grade encryption, role-based access control, and audit logs.",
    icon: ShieldCheck,
    color: "rose",
    details: ["GDPR & SOC2 compliance", "Access logs", "Data encryption"]
  },
  {
    title: "Fast & Scalable",
    description: "Built on high-performance cloud architecture to handle thousands of employees smoothly with 99.9% uptime.",
    icon: Zap,
    color: "indigo",
    details: ["Sub-second latency", "API integrations", "High availability"]
  }
] as const;


function NavLink({
  sectionId,
  label,
  isActive,
  onNavigate,
  className,
}: {
  sectionId: string;
  label: string;
  isActive: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <a
      href={`#${sectionId}`}
      className={`${className} relative py-2 px-4 rounded-full transition-all duration-350 ${
        isActive 
          ? "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 font-semibold" 
          : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 font-medium"
      }`}
      onClick={(e) => {
        e.preventDefault();
        scrollToSection(sectionId);
        onNavigate?.();
      }}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-650 dark:bg-blue-400 rounded-full shadow-sm" />
      )}
    </a>
  );
}


export default function Landing() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you for your message! Our team will get back to you shortly.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && NAV_LINKS.some((link) => link.id === hash)) {
      requestAnimationFrame(() => scrollToSection(hash));
    }
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px", // triggers when section enters the middle half of the screen
      threshold: 0.05,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    NAV_LINKS.forEach((link) => {
      const element = document.getElementById(link.id);
      if (element) observer.observe(element);
    });

    // Also fallback to scroll position for top/bottom detection
    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveSection("");
      }
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col transition-colors">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-lg z-50 border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
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
            
            <div className="hidden md:flex space-x-2 items-center">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.id}
                  sectionId={link.id}
                  label={link.label}
                  isActive={activeSection === link.id}
                  className=""
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
                  <Button onClick={() => signOut()} variant="ghost" className="hidden sm:inline-flex text-slate-600 dark:text-slate-300 hover:text-red-600 rounded-full px-4 font-medium">
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/auth" className="hidden sm:block">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all font-medium">
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
                  isActive={activeSection === link.id}
                  onNavigate={() => setMobileMenuOpen(false)}
                  className="block px-2 py-2"
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
      <div className="pt-32 pb-12 lg:pt-40 lg:pb-16 px-4 overflow-hidden relative flex-grow">
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
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-slate-200 dark:border-slate-800 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
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
      <section id="features" className="scroll-mt-20 py-16 bg-white dark:bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-5xl">
              Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">manage your team</span>
            </h2>
            <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Powerful tools designed to simplify your human resources workflow, from recruitment to retirement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              const colorClasses = {
                blue: {
                  bg: "bg-blue-50/50 dark:bg-blue-950/20",
                  border: "border-blue-100 dark:border-blue-900/30",
                  text: "text-blue-600 dark:text-blue-400",
                  hoverBorder: "hover:border-blue-300 dark:hover:border-blue-800",
                  hoverShadow: "hover:shadow-blue-500/5",
                  iconBg: "bg-blue-100 dark:bg-blue-900/50",
                  badgeBg: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300",
                },
                emerald: {
                  bg: "bg-emerald-50/50 dark:bg-emerald-950/20",
                  border: "border-emerald-100 dark:border-emerald-900/30",
                  text: "text-emerald-600 dark:text-emerald-400",
                  hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-800",
                  hoverShadow: "hover:shadow-emerald-500/5",
                  iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
                  badgeBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
                },
                purple: {
                  bg: "bg-purple-50/50 dark:bg-purple-950/20",
                  border: "border-purple-100 dark:border-purple-900/30",
                  text: "text-purple-600 dark:text-purple-400",
                  hoverBorder: "hover:border-purple-300 dark:hover:border-purple-800",
                  hoverShadow: "hover:shadow-purple-500/5",
                  iconBg: "bg-purple-100 dark:bg-purple-900/50",
                  badgeBg: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300",
                },
                amber: {
                  bg: "bg-amber-50/50 dark:bg-amber-950/20",
                  border: "border-amber-100 dark:border-amber-900/30",
                  text: "text-amber-600 dark:text-amber-400",
                  hoverBorder: "hover:border-amber-300 dark:hover:border-amber-800",
                  hoverShadow: "hover:shadow-amber-500/5",
                  iconBg: "bg-amber-100 dark:bg-amber-900/50",
                  badgeBg: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
                },
                rose: {
                  bg: "bg-rose-50/50 dark:bg-rose-950/20",
                  border: "border-rose-100 dark:border-rose-900/30",
                  text: "text-rose-600 dark:text-rose-400",
                  hoverBorder: "hover:border-rose-300 dark:hover:border-rose-800",
                  hoverShadow: "hover:shadow-rose-500/5",
                  iconBg: "bg-rose-100 dark:bg-rose-900/50",
                  badgeBg: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300",
                },
                indigo: {
                  bg: "bg-indigo-50/50 dark:bg-indigo-950/20",
                  border: "border-indigo-100 dark:border-indigo-900/30",
                  text: "text-indigo-600 dark:text-indigo-400",
                  hoverBorder: "hover:border-indigo-300 dark:hover:border-indigo-800",
                  hoverShadow: "hover:shadow-indigo-500/5",
                  iconBg: "bg-indigo-100 dark:bg-indigo-900/50",
                  badgeBg: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300",
                },
              }[feature.color];

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className={`group p-8 rounded-3xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/40 ${colorClasses.hoverBorder} hover:shadow-2xl ${colorClasses.hoverShadow} transition-all duration-300 flex flex-col justify-between`}
                >
                  <div>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:text-white ${colorClasses.iconBg} ${feature.color === 'blue' ? 'group-hover:from-blue-600 group-hover:to-cyan-600' : feature.color === 'emerald' ? 'group-hover:from-emerald-600 group-hover:to-teal-600' : feature.color === 'purple' ? 'group-hover:from-purple-600 group-hover:to-indigo-600' : feature.color === 'amber' ? 'group-hover:from-amber-600 group-hover:to-orange-600' : feature.color === 'rose' ? 'group-hover:from-rose-600 group-hover:to-pink-600' : 'group-hover:from-indigo-600 group-hover:to-blue-600'}`}>
                      <Icon className={`h-7 w-7 transition-all duration-300 group-hover:rotate-6 ${colorClasses.text} group-hover:text-white`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                      {feature.title}
                    </h3>
                    
                    <p className="text-slate-650 dark:text-slate-400 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                  </div>
                  
                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5 mt-auto">
                    <ul className="flex flex-wrap gap-2">
                      {feature.details.map((detail) => (
                        <li key={detail} className={`text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200/10 ${colorClasses.badgeBg}`}>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="about" className="scroll-mt-20 py-16 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-5xl">
              Why teams choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">HR Portal</span>
            </h2>
            <p className="mt-4 text-xl text-slate-650 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              We combine powerful HR tools with an intuitive experience so your team can focus on people, not paperwork.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Column: Value Cards */}
            <div className="lg:col-span-7 space-y-6">
              {[
                {
                  title: "All-in-One Workspace",
                  desc: "Manage employees, automated payroll, shifts, and reviews in one unified workspace.",
                  iconBg: "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
                },
                {
                  title: "Role-Based Security",
                  desc: "Granular access permissions for admins, HR managers, supervisors, and employees.",
                  iconBg: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
                },
                {
                  title: "Real-Time Actionable Insights",
                  desc: "Visual payroll charts, attendance analytics, and dynamic reviews at your fingertips.",
                  iconBg: "bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
                },
                {
                  title: "Built for Modern Scalability",
                  desc: "Easily scales custom structures to handle startups or multi-branch global organizations.",
                  iconBg: "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
                }
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="flex gap-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg} transition-transform group-hover:scale-115`}>
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Column: Platform Preview & Stats */}
            <div className="lg:col-span-5 space-y-8">
              {/* Mock Dashboard Widget */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 p-6 shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
                
                {/* Header of Mock widget */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="text-xs font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Active Workspace</div>
                    <div className="text-lg font-bold text-slate-800 dark:text-white">HR Summary</div>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/30">
                    Live System
                  </span>
                </div>

                {/* Progress bars inside mock widget */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5 font-medium">
                      <span className="text-slate-650 dark:text-slate-400">Payroll Processing</span>
                      <span className="text-blue-650 dark:text-blue-400">92% Done</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all" style={{ width: "92%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1.5 font-medium">
                      <span className="text-slate-650 dark:text-slate-400">Leave Requests Approved</span>
                      <span className="text-purple-650 dark:text-purple-400">98% Approved</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-600 dark:bg-purple-555 h-full rounded-full transition-all" style={{ width: "98%" }}></div>
                    </div>
                  </div>
                  
                  <div className="pt-3 flex gap-4 items-center">
                    <div className="flex -space-x-2.5 overflow-hidden">
                      <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-blue-500 text-white font-bold text-xs flex items-center justify-center">A</div>
                      <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-emerald-500 text-white font-bold text-xs flex items-center justify-center">S</div>
                      <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-purple-500 text-white font-bold text-xs flex items-center justify-center">J</div>
                      <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-amber-500 text-white font-bold text-xs flex items-center justify-center">+5</div>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Team onboarding status active
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Grid of Stats Cards */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { val: "50%", label: "Less admin time", color: "text-blue-600 dark:text-blue-400" },
                  { val: "3x", label: "Faster onboarding", color: "text-emerald-600 dark:text-emerald-400" },
                  { val: "100%", label: "Cloud security", color: "text-purple-600 dark:text-purple-400" },
                  { val: "24/7", label: "Expert support", color: "text-amber-600 dark:text-amber-400" }
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 hover:border-slate-350 dark:hover:border-slate-700 hover:shadow-md transition-all text-center"
                  >
                    <div className={`text-4xl font-extrabold ${stat.color} mb-1`}>{stat.val}</div>
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-20 py-16 bg-white dark:bg-slate-900 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-5xl">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">touch</span>
            </h2>
            <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Have questions? Our team is here to help you get started with HR Portal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
            {/* Left Column: Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 bg-slate-50/50 dark:bg-slate-800/25 backdrop-blur-md p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send us a message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-blue-500/30 dark:focus:border-blue-500 transition-all text-sm font-medium shadow-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-blue-500/30 dark:focus:border-blue-500 transition-all text-sm font-medium shadow-sm"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-blue-500/30 dark:focus:border-blue-500 transition-all text-sm font-medium shadow-sm"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us details about your project or questions..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-blue-500/30 dark:focus:border-blue-500 transition-all text-sm font-medium shadow-sm resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all text-sm font-semibold flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Sending Message...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Right Column: Info Panel */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-8">
              <div className="space-y-6">
                {/* Email Info Card */}
                <motion.a
                  href="mailto:info@whitedavid23.org"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-5 p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-800/50 hover:border-blue-300 dark:hover:border-blue-800 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-0.5">Email us</h4>
                    <p className="text-slate-600 dark:text-slate-350 font-semibold text-base break-all">info@whitedavid23.org</p>
                  </div>
                </motion.a>

                {/* Call Info Card */}
                <motion.a
                  href="tel:8757219471"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-5 p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-800/50 hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-0.5">Call us</h4>
                    <p className="text-slate-650 dark:text-slate-300 font-semibold text-base">8757219471</p>
                  </div>
                </motion.a>

                {/* Visit Info Card */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-5 p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-800/50 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-0.5">Visit us</h4>
                    <p className="text-slate-650 dark:text-slate-300 font-semibold text-base leading-snug">India, Jharkhand, Deoghar</p>
                  </div>
                </motion.div>
              </div>

              {/* Embedded Google Map Widget */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner h-60 relative group"
              >
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3631.0099823603978!2d86.69224767535889!3d24.48511097817625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f13ddadc3ca69b%3A0x7219c4be9bdd9e19!2sWhiteDavid23!5e0!3m2!1sen!2sin!4v1781268357631!5m2!1sen!2sin" 
                  className="w-full h-full border-0 grayscale dark:invert-[90%] dark:hue-rotate-[180deg] transition-all duration-300 group-hover:grayscale-0 dark:group-hover:invert-0 dark:group-hover:hue-rotate-0" 
                  allowFullScreen={true}
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="WhiteDavid23 Location Map"
                />

                <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 relative z-20 flex justify-between items-center shadow-md">
                  <div>
                    <div className="text-xs font-bold text-slate-850 dark:text-white">Deoghar HQ</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Jharkhand, India</div>
                  </div>
                  <a
                    href="https://www.google.com/maps/place/WhiteDavid23/@24.485111,86.692248,16z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-blue-650 dark:text-blue-450 hover:underline flex items-center gap-1"
                  >
                    Open Map
                  </a>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="text-center mt-10">
            {!user && (
              <Link to="/auth">
                <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8 shadow-md hover:shadow-lg transition-all font-semibold">
                  Start your free trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 text-slate-400 mt-auto">
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

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 z-50 p-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-blue-500/30 transition-all hover:-translate-y-1 group"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
