## What changed

Describe the change and the problem it solves.

## Verification

Explain how the change was checked.

- [ ] Game facts are grounded in official sources or verified gameplay when relevant
- [ ] Runtime/embed behavior was verified when changed
- [ ] Strict config/schema validation remains green
- [ ] Regression tests were added/updated when a machine rule changed
- [ ] On-Page SEO hard gates remain intact
- [ ] Multilingual SEO relationships were checked when relevant
- [ ] Demo vs production status is labeled accurately
- [ ] Responsive/accessibility impact was checked
- [ ] Browser QA / axe was run when relevant
- [ ] Lighthouse was run when performance behavior changed
- [ ] Documentation/examples were updated when behavior changed

## Hard-gate impact

Does this PR change any of the following?

- [ ] project schema / config validation
- [ ] iframe/runtime verification
- [ ] content provenance / accuracy rules
- [ ] page architecture
- [ ] multilingual SEO / hreflang
- [ ] design acceptance rules
- [ ] On-Page SEO gate
- [ ] accessibility / Browser QA
- [ ] Lighthouse / performance thresholds
- [ ] final QA / deployment-ready criteria

If yes, explain why the change is safe and how the new behavior should be validated. Do not weaken a hard gate solely to make CI green.

## Example status (if adding a game example)

```text
Game:
Official source:
Embed: VERIFIED | UNSUPPORTED | MANUAL CHECK REQUIRED
Languages:
Primary intent:
On-Page SEO: PASS | FAIL | NOT PRODUCTION TESTED
Multilingual SEO: PASS | FAIL | NOT APPLICABLE
Browser QA: PASS | FAIL | NOT RUN
Accessibility: PASS | FAIL | NOT RUN
Lighthouse: PASS | FAIL | NOT RUN
Design direction:
Blocking issues:
```
