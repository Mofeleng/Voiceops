import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { OrginizationGuard } from "@/modules/auth/ui/components/organization-guard";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthGuard>
            <OrginizationGuard>
                { children }
            </OrginizationGuard>
        </AuthGuard>
    )
}

export default Layout;