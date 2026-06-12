import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import logo from "@/assets/logo.png";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast({ title: "Welcome back!" });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-muted/40 to-background flex items-center justify-center p-4 overflow-hidden selection:bg-primary/20">
      {/* Decorative Floating Ambient Glows */}
      <div className="absolute -top-[30%] -left-[30%] w-[70%] h-[70%] rounded-full bg-primary/10 dark:bg-primary/15 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: "15s" }} />
      <div className="absolute -bottom-[30%] -right-[30%] w-[70%] h-[70%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: "20s" }} />
      
      {/* Modern Tech Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:16px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Subtle Outer Glow behind Card */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-indigo-500 opacity-10 dark:opacity-20 blur-xl pointer-events-none" />

        {/* Premium Sign In Card */}
        <Card className="relative shadow-2xl border border-border/80 dark:border-white/10 bg-card/75 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden rounded-2xl">
          {/* Dynamic Top Edge Accent */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-primary via-indigo-500 to-purple-600" />
          
          <CardHeader className="text-center pb-3 pt-8">
            {/* Secure portal capsule badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mx-auto mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              Secure Portal Access
            </div>

            <div className="mx-auto mb-4 relative group">
              {/* Logo outline glow effect */}
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary to-indigo-500 opacity-30 group-hover:opacity-50 blur-sm transition-opacity duration-300" />
              <img 
                src={logo} 
                alt="HR Portal Logo" 
                className="relative h-20 w-20 rounded-xl mx-auto border border-border bg-background shadow-lg object-contain p-1"
              />
            </div>
            
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground mt-2">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm mt-1">
              Sign in to your account to access the workspace
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-8 px-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Address */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground/80">Email Address</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground/60 group-focus-within:text-primary transition-colors duration-200">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="pl-11 bg-background/50 border-input text-foreground placeholder-muted-foreground/50 focus-visible:ring-primary/20 focus-visible:ring-2 focus-visible:border-primary transition-all duration-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground/80">Password</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground/60 group-focus-within:text-primary transition-colors duration-200">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="pl-11 pr-11 bg-background/50 border-input text-foreground placeholder-muted-foreground/50 focus-visible:ring-primary/20 focus-visible:ring-2 focus-visible:border-primary transition-all duration-300 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground/60 hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full relative overflow-hidden bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2.5 h-11 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:scale-[1.01] active:scale-[0.99] rounded-xl flex items-center justify-center gap-2 mt-2" 
                disabled={loading}
              >
                {loading ? (
                  <motion.div 
                    className="h-5 w-5 border-2 border-current border-t-transparent rounded-full" 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} 
                  />
                ) : (
                  <>
                    <LogIn className="h-4.5 w-4.5" /> 
                    <span>Sign In</span>
                  </>
                )}
              </Button>
            </form>

            {/* Trusted Security Banner */}
            <div className="mt-8 pt-5 border-t border-border/60 flex items-center justify-center gap-1.5 text-xs text-muted-foreground/80">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Enterprise-grade 256-bit SSL protection</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

