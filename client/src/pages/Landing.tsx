import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Building2, 
  Users, 
  Banknote, 
  CalendarDays, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";
import logo from "@/assets/logo.png";

export default function Landing() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <img 
                src={logo} 
                alt="HR Portal Logo" 
                className="h-12 w-12 object-contain"
              />
              <span className="text-xl font-bold text-slate-900 tracking-tight">HR Portal</span>
            </div>
            
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Features</a>
              <a href="#about" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Why Us</a>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Contact</a>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-full px-6 shadow-sm transition-all">
                      Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button onClick={() => signOut()} variant="ghost" className="text-slate-600 hover:text-red-600 rounded-full px-4">
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all">
                    Login / Register
                  </Button>
                 </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 overflow-hidden relative flex-grow">
        {/* Decorative background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl opacity-60 mix-blend-multiply animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-400/20 rounded-full blur-3xl opacity-60 mix-blend-multiply animate-blob [animation-delay:2s]"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl opacity-60 mix-blend-multiply animate-blob [animation-delay:4s]"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium text-sm mb-8 border border-blue-100 shadow-sm transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-3 duration-500">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            Modernize your workforce management
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            The Complete Platform for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">HR Excellence</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
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
                 <Button onClick={() => signOut()} size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-slate-300 hover:bg-red-50 text-slate-700 hover:text-red-600 transition-all bg-white shadow-sm">
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
            <Link to="#features">
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-slate-300 hover:bg-slate-100 text-slate-700 transition-all bg-white shadow-sm">
                Explore Features
              </Button>
            </Link>
          </div>
          
          {/* Stats Bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-slate-200 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
             <div className="flex flex-col items-center">
               <div className="text-4xl font-bold text-slate-900 mb-1">99.9%</div>
               <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Uptime</div>
             </div>
             <div className="flex flex-col items-center">
               <div className="text-4xl font-bold text-slate-900 mb-1">10k+</div>
               <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Companies</div>
             </div>
             <div className="flex flex-col items-center">
               <div className="text-4xl font-bold text-slate-900 mb-1">1M+</div>
               <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Employees Managed</div>
             </div>
             <div className="flex flex-col items-center">
               <div className="text-4xl font-bold text-slate-900 mb-1">24/7</div>
               <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Support</div>
             </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Everything you need to manage your team</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful tools designed to simplify your human resources workflow, from recruitment to retirement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-2xl hover:border-blue-100 transition-all hover:-translate-y-2 duration-300 group">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">Employee Database</h3>
              <p className="text-slate-600 leading-relaxed">
                Centralize all employee records, documents, and historical data in one secure, easily accessible platform.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-2xl hover:border-emerald-100 transition-all hover:-translate-y-2 duration-300 group">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Banknote className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">Automated Payroll</h3>
              <p className="text-slate-600 leading-relaxed">
                Run payroll accurately and on time with automated calculations, tax deductions, and direct deposits.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-2xl hover:border-purple-100 transition-all hover:-translate-y-2 duration-300 group">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <CalendarDays className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">Time & Attendance</h3>
              <p className="text-slate-600 leading-relaxed">
                Track employee hours, manage leave requests, and monitor attendance patterns with intuitive tools.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-2xl hover:border-amber-100 transition-all hover:-translate-y-2 duration-300 group">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-7 w-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">Performance Reviews</h3>
              <p className="text-slate-600 leading-relaxed">
                Set goals, conduct appraisals, and track employee growth with customizable review cycles and templates.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-2xl hover:border-rose-100 transition-all hover:-translate-y-2 duration-300 group">
              <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="h-7 w-7 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-rose-600 transition-colors">Compliance & Security</h3>
              <p className="text-slate-600 leading-relaxed">
                Rest easy knowing your organizational data is protected with enterprise-grade security and compliance tools.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-2xl hover:border-indigo-100 transition-all hover:-translate-y-2 duration-300 group">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">Fast & Scalable</h3>
              <p className="text-slate-600 leading-relaxed">
                Built on modern architecture, our platform scales effortlessly from small teams to large enterprises.
              </p>
            </div>
          </div>
        </div>
      </div>

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
                <div className="flex space-x-4">
                  {/* Social placeholders */}
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                    <div className="w-4 h-4 bg-slate-400 rounded-sm"></div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                    <div className="w-4 h-4 bg-slate-400 rounded-full"></div>
                  </div>
                </div>
             </div>
             
             <div>
                <h4 className="text-white font-semibold mb-6 flex items-center gap-2">Product</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link to="/info/features" className="hover:text-white transition-colors">Features</Link></li>
                  <li><Link to="/info/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link to="/info/security" className="hover:text-white transition-colors">Security</Link></li>
                  <li><Link to="/info/updates" className="hover:text-white transition-colors">Updates</Link></li>
                </ul>
             </div>

             <div>
                <h4 className="text-white font-semibold mb-6">Company</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link to="/info/about" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link to="/info/careers" className="hover:text-white transition-colors">Careers</Link></li>
                  <li><Link to="/info/blog" className="hover:text-white transition-colors">Blog</Link></li>
                  <li><Link to="/info/contact" className="hover:text-white transition-colors">Contact</Link></li>
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
