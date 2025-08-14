import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { OrginizationGuard } from "@/modules/auth/ui/components/organization-guard";
import { DashboardLayout } from "@/modules/dashboard/ui/layouts/dashboard-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
       <DashboardLayout>
        { children }
        </DashboardLayout>
    )
}

export default Layout;