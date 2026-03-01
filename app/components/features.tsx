import { AnimatedBackground } from "./animated-background";

export function AnimatedCardBackgroundHover() {
  // Updated items to reflect the Legacy Archaeologist Mapper workflow
  const ITEMS = [
    {
      id: 1,
      title: "Code Mapping",
      description:
        "Extract pure business logic and ignore syntax-specific boilerplate.",
    },
    {
      id: 2,
      title: "Logic Manifest",
      description:
        "Break legacy code into JSON-structured functions, inputs, and rules.",
    },
    {
      id: 3,
      title: "Mermaid Visualizer",
      description:
        "Generate live flowcharts and subgraphs of your data architecture.",
    },
    {
      id: 4,
      title: "System Scaffolding",
      description:
        "Generate modern FastAPI project structures with Pydantic models.",
    },
    {
      id: 5,
      title: "Logic Porting",
      description:
        "Rewrite legacy functions into modern endpoints with Dependency Injection.",
    },
    {
      id: 6,
      title: "Behavioral Testing",
      description:
        "Automatic pytest generation to ensure parity with original systems.",
    },
  ];

  return (
    // Wrap the grid container with a rounded border
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700/50 mt-10 mb-10">
      <div className="grid grid-cols-1 gap-4 p-10 sm:grid-cols-2 md:grid-cols-3">
        <AnimatedBackground
          className="rounded-lg bg-zinc-100 dark:bg-zinc-800/50"
          transition={{
            type: "spring",
            bounce: 0.2,
            duration: 0.6,
          }}
          enableHover
        >
          {ITEMS.map((item) => (
            <div key={item.id} data-id={`card-${item.id}`} className="h-full">
              <div className="flex h-full select-none flex-col space-y-2 p-5">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </AnimatedBackground>
      </div>
    </div>
  );
}
