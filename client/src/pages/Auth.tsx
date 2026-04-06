import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LogIn, UserPlus, Shield, Users, GraduationCap, Briefcase, BookOpen } from "lucide-react";

const DEMO_ACCOUNTS = [
  { role: "super_admin", label: "Super Admin", email: "superadmin@demo.com", password: "demo123456", icon: Shield, color: "bg-red-500" },
  { role: "hr_admin", label: "HR Admin", email: "hradmin@demo.com", password: "demo123456", icon: Briefcase, color: "bg-blue-500" },
  { role: "employee", label: "Employee", email: "employee@demo.com", password: "demo123456", icon: Users, color: "bg-green-500" },
  { role: "trainer", label: "Trainer", email: "trainer@demo.com", password: "demo123456", icon: GraduationCap, color: "bg-purple-500" },
  { role: "student", label: "Student", email: "student@demo.com", password: "demo123456", icon: BookOpen, color: "bg-amber-500" },
];

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState("employee");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const { signIn, signUp, setupDemoAccount } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, fullName, selectedRole);
        toast({ title: "Account created!", description: "You can now sign in." });
      } else {
        await signIn(email, password);
        toast({ title: "Welcome back!" });
      }
      navigate("/");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demo: typeof DEMO_ACCOUNTS[0]) => {
    setDemoLoading(demo.role);
    try {
      await setupDemoAccount(demo.email, demo.password, demo.label, demo.role);
      toast({ title: `Logged in as ${demo.label}` });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Demo login failed", description: err.message, variant: "destructive" });
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Sign In / Sign Up Form */}
        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">HR</span>
            </div>
            <CardTitle className="text-2xl">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription>
              {isSignUp ? "Sign up to access the HR & ERP System" : "Sign in to your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {isSignUp && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" required />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
              </div>

              <AnimatePresence mode="wait">
                {isSignUp && (
                  <motion.div
                    key="role"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Label>Role</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {["employee", "trainer", "student"].map(role => (
                        <Button
                          key={role}
                          type="button"
                          variant={selectedRole === role ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedRole(role)}
                          className="capitalize"
                        >
                          {role}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <motion.div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }} />
                ) : isSignUp ? (
                  <><UserPlus className="mr-2 h-4 w-4" /> Sign Up</>
                ) : (
                  <><LogIn className="mr-2 h-4 w-4" /> Sign In</>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-primary hover:underline"
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Login Section */}
        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Quick Demo Login</CardTitle>
            <CardDescription>Try the system with different roles — no signup needed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {DEMO_ACCOUNTS.map(demo => (
              <motion.div key={demo.role} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-3 px-4"
                  onClick={() => handleDemoLogin(demo)}
                  disabled={demoLoading !== null}
                >
                  <div className={`h-9 w-9 rounded-lg ${demo.color} flex items-center justify-center mr-3 shrink-0`}>
                    <demo.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">{demo.label}</div>
                    <div className="text-xs text-muted-foreground">{demo.email}</div>
                  </div>
                  {demoLoading === demo.role && (
                    <motion.div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }} />
                  )}
                </Button>
              </motion.div>
            ))}

            <div className="mt-4 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
              <p className="font-medium mb-1">Role Permissions:</p>
              <ul className="space-y-1">
                <li><strong>Super Admin:</strong> Full system control</li>
                <li><strong>HR Admin:</strong> Manage employees, payroll, recruitment</li>
                <li><strong>Employee:</strong> View tasks, submit reports, apply leave</li>
                <li><strong>Trainer:</strong> Manage batches, track performance</li>
                <li><strong>Student:</strong> View batches, submit reports, attendance</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
