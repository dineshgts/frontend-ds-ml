import type { ReactNode } from "react";
import PageContainer from "./PageContainer";
import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceNavigation, {
  type WorkspaceNavigationItem,
  type WorkspaceNavigationVariant,
} from "@/components/navigation/WorkspaceNavigation";

interface WorkspaceLayoutProps {
  title: string;
  description?: string;
  headerActions?: ReactNode;
  navigation: WorkspaceNavigationItem[];
  navigationVariant?: WorkspaceNavigationVariant;
  activeNavigationHref?: string;
  children: ReactNode;
}

export default function WorkspaceLayout({
  title,
  description,
  headerActions,
  navigation,
  navigationVariant = "tabs",
  activeNavigationHref,
  children,
}: WorkspaceLayoutProps) {
  return (
    <div className="min-w-0">
      <PageContainer size={navigationVariant === "sidebar" ? "wide" : "default"}>
        <WorkspaceHeader
          title={title}
          description={description}
          actions={headerActions}
        />

        {navigationVariant === "sidebar" ? (
          <div className="mt-6 flex min-w-0 flex-col gap-6 md:flex-row md:items-start">
            <WorkspaceNavigation
              variant="sidebar"
              items={navigation}
              activeHref={activeNavigationHref}
              className="md:w-56 md:flex-none"
            />
            <section className="min-w-0 flex-1" aria-label={`${title} content`}>
              {children}
            </section>
          </div>
        ) : (
          <>
            <div className="mt-6">
              <WorkspaceNavigation
                variant="tabs"
                items={navigation}
                activeHref={activeNavigationHref}
              />
            </div>
            <section className="mt-6 min-w-0" aria-label={`${title} content`}>
              {children}
            </section>
          </>
        )}
      </PageContainer>
    </div>
  );
}
