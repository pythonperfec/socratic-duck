# Socratic Duck Benchmark Suite (`bench/`)

This directory will hold:
1. **Leak Harness Evaluation Suite:** Test cases crafted to tempt the model into leaking answers (syntax queries, begging queries, stack trace analysis).
2. **Benchmark Runner:** Script to run evaluation runs across Gemma 4 / Ollama and measure leak prevention accuracy and question quality.
3. **Guard Efficacy Tests:** Automated checks ensuring code fences and forbidden phrases are 100% intercepted by the guard harness.
