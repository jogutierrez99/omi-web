# Contratos del pipeline visual

## Handoff común

```yaml
task_id: string
original_request: string
objective: string
intended_use: concept | web | social | print_mockup | print_final
operation: generate | edit | composite | remove_background | resize | export
source_images: [path]
reference_roles:
  path: product | brand | composition | lighting | material | style
locked_invariants: [string]
editable_regions: [string]
brand_assets: [path]
output:
  width_px: number
  height_px: number
  format: png | webp | avif | jpg | tiff | pdf
  alpha_required: boolean
acceptance_criteria: [string]
qa_thresholds: [string]
```

## Resultado de producción

```yaml
status: completed | completed_with_warnings | blocked | failed
output_asset: path
tool_used: string
dimensions: { width: number, height: number }
alpha_status: present | absent | not_applicable | unverified
changes_intended: [string]
invariants_preserved: [string]
known_deviations: [string]
requires_compositing: boolean
```

## Incidencia de QA

```yaml
id: IMG-001
severity: blocker | high | medium | low
category: brand | text | product | geometry | composition | material | lighting | alpha | artifact | export
evidence: string
region: string
criterion: string
owner: art_director | specification | prompt_engineer | producer | compositor
recommended_fix: string
```

## Resultado de QA

```yaml
status: completed
verdict: PASS | PASS_WITH_WARNINGS | REJECT
criteria_results: []
per_format_results: []
issues: []
untested: []
next_action: string
```
