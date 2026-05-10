import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  CheckSquare,
  FileText,
  CalendarOff,
  IndianRupee,
  UserPlus,
  CalendarClock,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  Clock,
  Briefcase,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export function AppSidebar() {
  const { state } = useSidebar();
  const { role } = useAuth();
  const collapsed = state === "collapsed";
  
  const isHR = role === "super_admin" || role === "hr_admin";

  const mainNav = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    ...(isHR ? [{ title: "Employees", url: "/employees", icon: Users }] : []),
    ...(isHR ? [{ title: "Trainers", url: "/trainers", icon: GraduationCap }] : []),
    ...(isHR ? [{ title: "Students", url: "/students", icon: BookOpen }] : []),
    ...(isHR ? [{ title: "Interns", url: "/interns", icon: Briefcase }] : []),
    { title: "Batches", url: "/batches", icon: Layers },
  ];

  const workNav = [
    { title: "Tasks", url: "/tasks", icon: CheckSquare },
    { title: "Daily Reports", url: "/daily-reports", icon: FileText },
    { title: "Leave", url: "/leave", icon: CalendarOff },
    { title: "Attendance", url: "/attendance", icon: Clock },
  ];

  const hrNav = isHR ? [
    { title: "Payroll", url: "/payroll", icon: IndianRupee },
    { title: "Recruitment", url: "/recruitment", icon: UserPlus },
    { title: "Interviews", url: "/interviews", icon: CalendarClock },
    { title: "Performance", url: "/performance", icon: TrendingUp },
  ] : [];

  const systemNav = [
    ...(isHR ? [{ title: "Reports", url: "/reports", icon: BarChart3 }] : []),
  ];

  function NavGroup({ label, items }: { label: string; items: any[] }) {
    if (items.length === 0) return null;
    return (
      <SidebarGroup>
        <SidebarGroupLabel>{label}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.url}
                    end={item.url === "/"}
                    className="hover:bg-accent/80 transition-colors"
                    activeClassName="bg-primary/10 text-primary font-medium"
                  >
                    <item.icon className="mr-2 h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <img 
            src="/logo.png" 
            alt="HR Portal Logo" 
            className="h-10 w-10 md:h-12 md:w-12 rounded-lg shrink-0 object-contain"
          />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sm">HR & ERP</span>
              <span className="text-[10px] text-muted-foreground">Management System</span>
            </div>
          )}
        </motion.div>
      </SidebarHeader>

      <SidebarContent>
        <NavGroup label="Overview" items={mainNav} />
        <NavGroup label="Work" items={workNav} />
        {hrNav.length > 0 && <NavGroup label="HR Management" items={hrNav} />}
        <NavGroup label="System" items={systemNav} />
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/settings" className="hover:bg-accent/80" activeClassName="bg-primary/10 text-primary">
                <Settings className="mr-2 h-4 w-4" />
                {!collapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
