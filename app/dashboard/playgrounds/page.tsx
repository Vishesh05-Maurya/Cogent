import ProjectTable from "@/features/dashboard/components/project-table";
import { getAllPlaygroundForUser, deleteProjectById, editProjectById, duplicateProjectById } from "@/features/playground/actions";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <img src="/empty-state.svg" alt="No projects" className="w-48 h-48 mb-4" />
    <h2 className="text-xl font-semibold text-gray-500">No projects found</h2>
    <p className="text-gray-400">Create a new project to get started!</p>
  </div>
);

const AllPlaygroundsPage = async () => {
  // Fetch the same data structure returned by getAllPlaygroundForUser()
  const playgrounds = await getAllPlaygroundForUser();
  
  return (
    <div className="flex flex-col justify-start items-center min-h-screen mx-auto max-w-7xl px-4 py-10">
      <div className="w-full mb-6">
        <h1 className="text-3xl font-bold mb-2">My Playgrounds</h1>
        <p className="text-muted-foreground text-sm">View and manage all the amazing code playgrounds you've created so far.</p>
      </div>
      
      <div className="mt-4 flex flex-col justify-center items-center w-full bg-background rounded-lg border shadow-sm p-4">
        {playgrounds && playgrounds.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="w-full">
            <ProjectTable
              projects={playgrounds || []}
              onDeleteProject={deleteProjectById}
              onUpdateProject={editProjectById}
              onDuplicateProject={duplicateProjectById}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPlaygroundsPage;
