export const DEFAULT_MEMBERS = ["Unassigned"];

export const DEFAULT_TEMPLATES = [
  {
    id: "tpl-demo",
    name: "Incident Response",
    description: "Standard incident response procedure",
    checklists: [
      {
        id: "cl-1", name: "Initial Triage",
        tasks: [
          { id: "t-1", title: "Acknowledge incident", assignee: "Unassigned", type: "manual" },
          { id: "t-2", title: "Assess severity (SEV1-4)", assignee: "Unassigned", type: "manual" },
          { id: "t-3", title: "Notify stakeholders via webhook", assignee: "Unassigned", type: "http",
            automation: { method: "POST", url: "https://httpbin.org/post", headers: [{ key: "Content-Type", value: "application/json" }], body: '{"text":"Incident acknowledged"}' } },
        ],
      },
      {
        id: "cl-2", name: "Resolution",
        tasks: [
          { id: "t-4", title: "Identify root cause", assignee: "Unassigned", type: "manual" },
          { id: "t-5", title: "Implement fix", assignee: "Unassigned", type: "manual" },
          { id: "t-6", title: "Verify resolution", assignee: "Unassigned", type: "manual" },
        ],
      },
    ],
  },
];
