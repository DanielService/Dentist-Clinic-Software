import {
  Users, Calendar, Package, FileText, Settings,
  LayoutDashboard, Bell, ChevronRight, Stethoscope,
} from "lucide-react";
import { useState } from "react";
import { PrescriptionDialog } from "@/components/PrescriptionDialog";
import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Patients", url: "/patients", icon: Users },
  { title: "Appointments", url: "/appointments", icon: Calendar },
  { title: "Factures", url: "/factures", icon: FileText },
  { title: "Stock", url: "/stock", icon: Package },
];

const bottomItems = [
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const isActive = (url: string) =>
    url === "/" ? location.pathname === "/" : location.pathname.startsWith(url);

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      {/* Logo */}
      <SidebarHeader className="border-b border-border py-4 px-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary shadow-[var(--shadow-primary)]">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C9.5 2 8 4 8 6c0 1.5.5 2.5 1 3.5L8 17c0 1.5 1 3 2 3s2-1.5 2-1.5S13.5 20 14 20c1 0 2-1.5 2-3l-1-7.5C15.5 8.5 16 7.5 16 6c0-2-1.5-4-4-4z" />
            </svg>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-foreground leading-tight truncate">DentaCare</p>
              <p className="text-xs text-muted-foreground truncate">Clinic Management</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main nav */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Main</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-2 w-full"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                      {!collapsed && item.url !== "/" && (
                        <ChevronRight className="ml-auto h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom nav */}
        <SidebarGroup className="mt-auto">
          {!collapsed && <SidebarGroupLabel>System</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-2 w-full"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Doctor profile + prescription shortcut */}
      <SidebarFooter className="border-t border-border py-3 px-3 space-y-2">
        {/* Prescription quick-launch */}
        <PrescriptionDialog
          trigger={
            <button
              className="flex items-center gap-2.5 w-full rounded-lg px-2 py-2 text-sm font-medium text-primary bg-primary/8 hover:bg-primary/15 transition-colors overflow-hidden"
              title="New Prescription"
            >
              <span className="text-xl font-serif leading-none shrink-0">℞</span>
              {!collapsed && <span className="truncate">New Prescription</span>}
            </button>
          }
        />
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="h-8 w-8 shrink-0 rounded-full bg-primary-light flex items-center justify-center text-primary text-xs font-bold">
            DR
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-foreground truncate leading-tight">Dr. Aicha</p>
              <p className="text-xs text-muted-foreground truncate">Admin</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
