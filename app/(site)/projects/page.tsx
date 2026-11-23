import ProjectsPage from "@/components/route-content/projects-page";
import { projectsMetadata } from "@/lib/page-metadata";

export const metadata = projectsMetadata;

export default function Page() {
  return <ProjectsPage />;
}
