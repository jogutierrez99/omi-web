# Contratos del equipo frontend OMI

Este documento define el vocabulario compartido y los contratos mínimos entre agentes. Los agentes pueden añadir campos, pero no eliminar los requeridos ni cambiar su significado durante un workflow.

## 1. Estados

```ts
export type AgentStatus =
  | "pending"
  | "running"
  | "completed"
  | "completed_with_warnings"
  | "needs_input"
  | "blocked"
  | "failed";

export type QAVerdict = "PASS" | "PASS_WITH_WARNINGS" | "REJECT";

export type ValidationStatus =
  | "passed"
  | "failed"
  | "not_available"
  | "not_run";
```

## 2. Envoltorio común

```ts
export interface AgentEnvelope<TInput, TOutput> {
  workflowId: string;
  taskId: string;
  agent: AgentName;
  status: AgentStatus;
  iteration: number;
  input: TInput;
  output?: TOutput;
  warnings: string[];
  error?: AgentError;
  handoffTo?: AgentName;
}

export type AgentName =
  | "frontend_ideation"
  | "ui_design_specification"
  | "codex_prompt_engineer"
  | "frontend_developer"
  | "frontend_qa"
  | "frontend_orchestrator";
```

## 3. Handoff mínimo

```ts
export interface AgentHandoff {
  taskId: string;
  originalRequest: string;
  objective: string;
  scope: {
    in: string[];
    out: string[];
  };
  repositoryEvidence: RepositoryEvidence[];
  constraints: string[];
  acceptanceCriteria: AcceptanceCriterion[];
  inputArtifacts: ArtifactRef[];
  expectedOutput: string;
}

export interface RepositoryEvidence {
  path: string;
  symbol?: string;
  observation: string;
  relevance: string;
}

export interface ArtifactRef {
  kind: "request" | "design" | "specification" | "plan" | "diff" | "test" | "screenshot";
  pathOrId: string;
  description: string;
}
```

## 4. Criterios de aceptación

```ts
export interface AcceptanceCriterion {
  id: string;
  description: string;
  priority: "must" | "should" | "could";
  validationMethod: string;
  source: "user" | "design" | "technical" | "accessibility";
}

export interface CriterionResult {
  acceptanceId: string;
  status: "pass" | "fail" | "untested";
  evidence: string[];
  notes?: string;
}
```

Reglas:

- Todos los `must` deben pasar para `PASS`.
- Un criterio no probado nunca cuenta como aprobado.
- Los IDs permanecen estables durante las correcciones.

## 5. Validaciones

```ts
export interface ValidationCommand {
  name: string;
  command: string;
  purpose: string;
  required: boolean;
}

export interface ValidationResult {
  name: string;
  command?: string;
  status: ValidationStatus;
  exitCode?: number;
  evidence?: string;
  reason?: string;
}
```

`not_available` significa que el proyecto no ofrece esa validación. `not_run` significa que existía pero no se ejecutó; siempre requiere motivo.

## 6. Defectos de QA

```ts
export type IssueSeverity = "blocker" | "high" | "medium" | "low";

export type IssueCategory =
  | "functional"
  | "code"
  | "responsive"
  | "visual"
  | "accessibility"
  | "performance"
  | "security"
  | "regression"
  | "test";

export interface QAIssue {
  id: string;
  severity: IssueSeverity;
  category: IssueCategory;
  description: string;
  acceptanceIds: string[];
  evidence: string;
  reproduction: string[];
  affectedFile?: string;
  affectedViewport?: string;
  introducedByChange: boolean | "unknown";
  recommendedFix: string;
}
```

## 7. Resultado de desarrollo

```ts
export interface DevelopmentResult {
  status: AgentStatus;
  summary: string;
  changedFiles: string[];
  createdFiles: string[];
  deletedFiles: string[];
  implementationDecisions: string[];
  criteriaCoverage: Array<{
    acceptanceId: string;
    status: "implemented" | "partial" | "not_implemented";
    evidence: string[];
  }>;
  validations: ValidationResult[];
  warnings: string[];
  knownLimitations: string[];
}
```

## 8. Resultado de QA

```ts
export interface QAResult {
  status: AgentStatus;
  verdict: QAVerdict;
  criteriaResults: CriterionResult[];
  issues: QAIssue[];
  validationsExecuted: ValidationResult[];
  viewportsTested: Array<{
    width: number;
    height: number;
    status: "pass" | "fail" | "untested";
    notes: string[];
  }>;
  untested: Array<{
    item: string;
    reason: string;
    impact: string;
  }>;
  preExistingIssues: QAIssue[];
  warnings: string[];
  recommendedActions: string[];
}
```

## 9. Workflow

```ts
export type TaskIntent =
  | "idea"
  | "design"
  | "implementation"
  | "bug_diagnosis"
  | "bug_fix"
  | "review";

export interface WorkflowStep {
  id: string;
  agent: AgentName;
  status: AgentStatus;
  inputRef: string;
  outputRef?: string;
  warnings: string[];
}

export interface FrontendWorkflow {
  workflowId: string;
  originalRequest: string;
  intent: TaskIntent;
  status: AgentStatus;
  scope: { in: string[]; out: string[] };
  acceptanceCriteria: AcceptanceCriterion[];
  steps: WorkflowStep[];
  iteration: number;
  maxIterations: 3;
  finalQa?: QAResult;
}
```

## 10. Error normalizado

```ts
export interface AgentError {
  code:
    | "MISSING_DECISION"
    | "MISSING_CONTEXT"
    | "INVALID_HANDOFF"
    | "REPOSITORY_MISMATCH"
    | "VALIDATION_FAILED"
    | "PERMISSION_BLOCKED"
    | "TOOL_FAILURE"
    | "MAX_ITERATIONS";
  message: string;
  recoverable: boolean;
  evidence?: string[];
  requiredAction?: string;
}
```

## 11. Invariantes

1. `originalRequest`, `workflowId` y `taskId` no cambian.
2. Los criterios solo pueden añadirse o aclararse; un criterio del usuario no se elimina silenciosamente.
3. Todo cambio de alcance queda registrado.
4. Todo `failed` o `blocked` incluye error.
5. Todo `completed_with_warnings` incluye al menos un warning.
6. Todo cambio de código termina en QA.
7. `completed` con código exige `finalQa.verdict === "PASS"`.

