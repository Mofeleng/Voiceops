"use client";

import { useOrganization } from "@clerk/nextjs";
import { AuthLayout } from "../layouts/auth-layout";
import { OrganizationSelectView } from "../views/organization-select-view";

export const OrginizationGuard = ({ children }: { children: React.ReactNode }) => {
    const { organization } = useOrganization();

    if (!organization) {
        return (
            <div>
                <AuthLayout>
                    <OrganizationSelectView />
                </AuthLayout>
            </div>
        )
    }
    return (
        <div>
            { children }
        </div>
    )
}