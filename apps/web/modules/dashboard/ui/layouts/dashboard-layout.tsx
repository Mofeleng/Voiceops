import { AuthGuard } from "@/modules/auth/ui/components/auth-guard"
import { OrginizationGuard } from "@/modules/auth/ui/components/organization-guard"
import { SidebarProvider } from "@workspace/ui/components/sidebar"
import { cookies } from "next/headers"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { SIDEBAR_COOKIE_NAME } from "../../../../../../packages/ui/src/components/sidebar"

export const DashboardLayout = async ({ children }: { children: React.ReactNode })=> {

    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

    return (
        <AuthGuard>
            <OrginizationGuard>
                <SidebarProvider defaultOpen={defaultOpen}>
                    <DashboardSidebar />
                    <main className="flex flex-1 flex-col">
                        { children }
                    </main>                  
                </SidebarProvider>
            </OrginizationGuard>
        </AuthGuard>
    )
}