import WorkspaceSidebar from "./WorkspaceSidebar";
import WorkspaceTabs from "./WorkspaceTabs";

export type WorkspaceNavigationVariant = "tabs" | "sidebar";

export interface WorkspaceNavigationItem {
  label: string;
  href: string;
  active?: boolean;
  badge?: string | number;
}

export interface WorkspaceNavigationProps {
  variant?: WorkspaceNavigationVariant;
  items: WorkspaceNavigationItem[];
  activeHref?: string;
  className?: string;
}

export default function WorkspaceNavigation({
  variant = "tabs",
  items,
  activeHref,
  className = "",
}: WorkspaceNavigationProps) {
  return (
    <div className={className}>
      {variant === "sidebar" ? (
        <WorkspaceSidebar items={items} activeHref={activeHref} />
      ) : (
        <WorkspaceTabs items={items} activeHref={activeHref} />
      )}
    </div>
  );
}
