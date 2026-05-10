import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, Zap, Users, Banknote, CalendarDays, TrendingUp, Globe, Mail, Phone, MapPin, Clock } from "lucide-react";

const pages: Record<string, { title: string; content: React.ReactNode }> = {
  features: {
    title: "Features",
    content: (
      <div className="space-y-12">
        <p className="text-lg text-slate-600 max-w-3xl">Discover the powerful tools designed to simplify your human resources workflow, from recruitment to retirement.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Users, title: "Employee Database", desc: "Centralize all employee records, documents, and historical data in one secure, easily accessible platform.", color: "bg-blue-100 text-blue-600" },
            { icon: Banknote, title: "Automated Payroll", desc: "Run payroll accurately and on time with automated calculations, tax deductions, and direct deposits.", color: "bg-emerald-100 text-emerald-600" },
            { icon: CalendarDays, title: "Time & Attendance", desc: "Track employee hours, manage leave requests, and monitor attendance patterns with intuitive tools.", color: "bg-purple-100 text-purple-600" },
            { icon: TrendingUp, title: "Performance Reviews", desc: "Set goals, conduct appraisals, and track employee growth with customizable review cycles and templates.", color: "bg-amber-100 text-amber-600" },
            { icon: ShieldCheck, title: "Compliance & Security", desc: "Rest easy knowing your organizational data is protected with enterprise-grade security and compliance tools.", color: "bg-rose-100 text-rose-600" },
            { icon: Zap, title: "Fast & Scalable", desc: "Built on modern architecture, our platform scales effortlessly from small teams to large enterprises.", color: "bg-indigo-100 text-indigo-600" },
          ].map(f => (
            <div key={f.title} className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${f.color}`}><f.icon className="h-7 w-7" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  pricing: {
    title: "Pricing",
    content: (
      <div className="space-y-12">
        <p className="text-lg text-slate-600 max-w-3xl">Simple, transparent pricing that grows with your team. No hidden fees.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          {[
            { name: "Starter", price: "Free", period: "", desc: "For small teams getting started", features: ["Up to 10 employees", "Basic attendance", "Leave management", "Email support"] },
            { name: "Professional", price: "$9", period: "/employee/month", desc: "For growing businesses", features: ["Unlimited employees", "Automated payroll", "Performance reviews", "Priority support", "Custom reports"], popular: true },
            { name: "Enterprise", price: "Custom", period: "", desc: "For large organizations", features: ["Everything in Professional", "SSO & SAML", "Custom integrations", "Dedicated account manager", "SLA guarantee", "On-premise option"] },
          ].map(p => (
            <div key={p.name} className={`bg-white p-8 rounded-2xl border ${p.popular ? 'border-blue-500 ring-2 ring-blue-100 relative' : 'border-slate-100'} hover:shadow-xl transition-all`}>
              {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">Most Popular</div>}
              <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{p.desc}</p>
              <div className="mt-6 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">{p.price}</span>
                <span className="text-slate-500 text-sm">{p.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />{f}
                  </li>
                ))}
              </ul>
              <Button className={`w-full ${p.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`} variant={p.popular ? 'default' : 'outline'}>
                {p.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    )
  },
  security: {
    title: "Security",
    content: (
      <div className="space-y-12">
        <p className="text-lg text-slate-600 max-w-3xl">Your data security is our top priority. We employ industry-leading measures to protect your information.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          {[
            { title: "Data Encryption", desc: "All data is encrypted at rest and in transit using AES-256 encryption standards." },
            { title: "SOC 2 Compliant", desc: "Our infrastructure meets SOC 2 Type II compliance requirements for security and availability." },
            { title: "Access Controls", desc: "Role-based access controls ensure employees only see what they need to." },
            { title: "Regular Audits", desc: "Third-party security audits are conducted quarterly to ensure ongoing compliance." },
            { title: "GDPR Ready", desc: "Full compliance with GDPR and other regional data protection regulations." },
            { title: "99.9% Uptime SLA", desc: "Redundant infrastructure across multiple regions ensures high availability." },
          ].map(s => (
            <div key={s.title} className="bg-white p-6 rounded-xl border border-slate-100">
              <ShieldCheck className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-slate-600 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  updates: {
    title: "Updates",
    content: (
      <div className="space-y-8 max-w-3xl">
        <p className="text-lg text-slate-600">Stay up to date with the latest improvements and new features.</p>
        {[
          { date: "May 2026", version: "v3.2", title: "Batch Attendance & Real-time Notifications", desc: "Introduced batch attendance management with student enrollment, attendance history with edit capabilities, and real-time notification system with database integration." },
          { date: "Apr 2026", version: "v3.1", title: "Enhanced Reports & Settings", desc: "Added CSV export for Employee, Payroll, Task, and Leave reports with proper structure. Implemented password change functionality with database integration." },
          { date: "Mar 2026", version: "v3.0", title: "Dashboard Redesign", desc: "Complete dashboard overhaul with new analytics widgets, improved navigation, and faster load times." },
          { date: "Feb 2026", version: "v2.5", title: "Payroll Automation", desc: "Automated payroll generation with tax calculations, deduction management, and payslip generation." },
          { date: "Jan 2026", version: "v2.0", title: "Performance Module", desc: "New performance review module with goal setting, 360-degree feedback, and review cycles." },
        ].map(u => (
          <div key={u.version} className="bg-white p-6 rounded-xl border border-slate-100 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">{u.version}</span>
              <span className="text-sm text-slate-500">{u.date}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{u.title}</h3>
            <p className="text-slate-600 text-sm">{u.desc}</p>
          </div>
        ))}
      </div>
    )
  },
  about: {
    title: "About Us",
    content: (
      <div className="space-y-12 max-w-4xl">
        <p className="text-lg text-slate-600">We're on a mission to modernize workforce management for teams that want to do more, together.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Story</h3>
            <p className="text-slate-600 leading-relaxed mb-4">Founded in 2024, HR Portal was born from the frustration of dealing with scattered HR tools. We believed there had to be a better way — one unified platform that handles everything from hiring to retiring.</p>
            <p className="text-slate-600 leading-relaxed">Today, we serve over 10,000 companies worldwide, helping them manage more than a million employees efficiently and securely.</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { value: "10K+", label: "Companies" },
              { value: "1M+", label: "Employees Managed" },
              { value: "99.9%", label: "Uptime" },
              { value: "50+", label: "Team Members" },
            ].map(s => (
              <div key={s.label} className="bg-white p-6 rounded-xl border border-slate-100 text-center">
                <div className="text-3xl font-extrabold text-slate-900">{s.value}</div>
                <div className="text-sm text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  careers: {
    title: "Careers",
    content: (
      <div className="space-y-12 max-w-3xl">
        <p className="text-lg text-slate-600">Join our team and help shape the future of HR technology.</p>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Why Work With Us?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {["Remote-first culture", "Competitive compensation", "Health & wellness benefits", "Learning & development budget", "Flexible working hours", "Equity options"].map(b => (
              <div key={b} className="flex items-center gap-2 text-sm text-slate-700"><div className="h-1.5 w-1.5 rounded-full bg-blue-600" />{b}</div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-6">Open Positions</h3>
          <div className="space-y-4">
            {[
              { title: "Senior Full-Stack Engineer", dept: "Engineering", location: "Remote", type: "Full-time" },
              { title: "Product Designer", dept: "Design", location: "Remote", type: "Full-time" },
              { title: "Customer Success Manager", dept: "Support", location: "Remote", type: "Full-time" },
              { title: "DevOps Engineer", dept: "Engineering", location: "Remote", type: "Full-time" },
            ].map(j => (
              <div key={j.title} className="bg-white p-5 rounded-xl border border-slate-100 hover:shadow-lg transition-all flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">{j.title}</h4>
                  <p className="text-sm text-slate-500">{j.dept} · {j.location} · {j.type}</p>
                </div>
                <Button variant="outline" size="sm">Apply</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  blog: {
    title: "Blog",
    content: (
      <div className="space-y-8 max-w-3xl">
        <p className="text-lg text-slate-600">Insights, tips, and best practices for modern HR teams.</p>
        <div className="space-y-6">
          {[
            { title: "5 Ways to Improve Employee Retention in 2026", category: "HR Strategy", date: "May 5, 2026", read: "5 min read" },
            { title: "The Complete Guide to Performance Reviews", category: "Management", date: "Apr 28, 2026", read: "8 min read" },
            { title: "Automating Payroll: A Step-by-Step Guide", category: "Payroll", date: "Apr 15, 2026", read: "6 min read" },
            { title: "How to Build a Remote-First Culture", category: "Culture", date: "Mar 30, 2026", read: "7 min read" },
            { title: "Compliance Checklist for Growing Companies", category: "Legal", date: "Mar 18, 2026", read: "4 min read" },
          ].map(p => (
            <div key={p.title} className="bg-white p-6 rounded-xl border border-slate-100 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">{p.category}</span>
                <span className="text-xs text-slate-500">{p.date} · {p.read}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
            </div>
          ))}
        </div>
      </div>
    )
  },
  contact: {
    title: "Contact",
    content: (
      <div className="space-y-12 max-w-4xl">
        <p className="text-lg text-slate-600">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            {[
              { icon: Mail, label: "Email", value: "support@hrportal.com" },
              { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
              { icon: MapPin, label: "Office", value: "123 Innovation Drive, San Francisco, CA 94105" },
              { icon: Clock, label: "Business Hours", value: "Monday - Friday, 9am - 6pm PST" },
            ].map(c => (
              <div key={c.label} className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0"><c.icon className="h-5 w-5 text-blue-600" /></div>
                <div><p className="text-sm font-medium text-slate-900">{c.label}</p><p className="text-sm text-slate-600">{c.value}</p></div>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Send a Message</h3>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <input type="text" placeholder="Your Name" className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
              <input type="email" placeholder="Your Email" className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
              <textarea placeholder="Your Message" rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none" />
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    )
  },
  terms: {
    title: "Terms of Service",
    content: (
      <div className="max-w-3xl space-y-6 text-slate-600 text-sm leading-relaxed">
        <p className="text-lg">Last updated: January 1, 2026</p>
        <h3 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h3>
        <p>By accessing and using HR Portal ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.</p>
        <h3 className="text-lg font-bold text-slate-900">2. Use of Service</h3>
        <p>You may use our Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service in any way that violates any applicable law or regulation.</p>
        <h3 className="text-lg font-bold text-slate-900">3. User Accounts</h3>
        <p>You are responsible for maintaining the security of your account credentials. You must notify us immediately of any unauthorized use of your account.</p>
        <h3 className="text-lg font-bold text-slate-900">4. Data & Privacy</h3>
        <p>We collect and process data as described in our Privacy Policy. By using our Service, you consent to the collection and use of information in accordance with our Privacy Policy.</p>
        <h3 className="text-lg font-bold text-slate-900">5. Limitation of Liability</h3>
        <p>HR Portal shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.</p>
        <h3 className="text-lg font-bold text-slate-900">6. Changes to Terms</h3>
        <p>We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the Service.</p>
      </div>
    )
  },
  privacy: {
    title: "Privacy Policy",
    content: (
      <div className="max-w-3xl space-y-6 text-slate-600 text-sm leading-relaxed">
        <p className="text-lg">Last updated: January 1, 2026</p>
        <h3 className="text-lg font-bold text-slate-900">1. Information We Collect</h3>
        <p>We collect information you provide directly, such as account details, employee data, and communications. We also collect usage data automatically through cookies and similar technologies.</p>
        <h3 className="text-lg font-bold text-slate-900">2. How We Use Information</h3>
        <p>We use collected information to provide and improve our Service, communicate with you, and ensure the security of our platform.</p>
        <h3 className="text-lg font-bold text-slate-900">3. Data Sharing</h3>
        <p>We do not sell your personal information. We may share data with service providers who assist in operating our platform, subject to confidentiality obligations.</p>
        <h3 className="text-lg font-bold text-slate-900">4. Data Security</h3>
        <p>We implement industry-standard security measures including encryption, access controls, and regular security audits to protect your data.</p>
        <h3 className="text-lg font-bold text-slate-900">5. Your Rights</h3>
        <p>You have the right to access, correct, or delete your personal data. You may also opt out of certain data processing activities. Contact us to exercise these rights.</p>
        <h3 className="text-lg font-bold text-slate-900">6. Cookies</h3>
        <p>We use cookies and similar tracking technologies. See our Cookie Policy for more details on how we use cookies.</p>
      </div>
    )
  },
  cookies: {
    title: "Cookie Policy",
    content: (
      <div className="max-w-3xl space-y-6 text-slate-600 text-sm leading-relaxed">
        <p className="text-lg">Last updated: January 1, 2026</p>
        <h3 className="text-lg font-bold text-slate-900">1. What Are Cookies</h3>
        <p>Cookies are small text files placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our Service.</p>
        <h3 className="text-lg font-bold text-slate-900">2. Types of Cookies We Use</h3>
        <p><strong>Essential Cookies:</strong> Required for the Service to function properly, including authentication and security features.</p>
        <p><strong>Performance Cookies:</strong> Help us understand how visitors interact with our Service so we can improve it.</p>
        <p><strong>Functionality Cookies:</strong> Remember your preferences and settings to provide a personalized experience.</p>
        <h3 className="text-lg font-bold text-slate-900">3. Managing Cookies</h3>
        <p>You can control cookies through your browser settings. Note that disabling certain cookies may affect the functionality of our Service.</p>
        <h3 className="text-lg font-bold text-slate-900">4. Third-Party Cookies</h3>
        <p>We may use third-party services that place their own cookies. These are subject to the respective third-party privacy policies.</p>
      </div>
    )
  }
};

export default function FooterPage() {
  const { slug } = useParams<{ slug: string }>();
  const page = pages[slug || ""];

  if (!page) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Page Not Found</h1>
          <p className="text-slate-600 mb-6">The page you're looking for doesn't exist.</p>
          <Link to="/"><Button>Go Home</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="HR Portal Logo" className="h-16 w-16 rounded-xl" />
              <span className="text-xl font-bold text-slate-900 tracking-tight">HR Portal</span>
            </div>
            <Link to="/">
              <Button variant="ghost" className="text-slate-600"><ArrowLeft className="h-4 w-4 mr-2" />Back to Home</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-8">{page.title}</h1>
          {page.content}
        </div>
      </div>

      <footer className="bg-slate-950 py-8 text-slate-400 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} HR Portal Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
