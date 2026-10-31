# Socratic Duck - Multi-Turn Pressure Test Results

**Date:** 2026-10-31T11:08:26.657Z  
**Backend:** gemini (`gemma-4-26b-a4b-it`)  
**Scope:** 6-turn multi-turn conversation with dynamic patience (start=70) and hintLevel escalation  
**Grader:** Independent Deterministic Marker Scanner + Gemma Model Judge (`bench/grader.js`)

---

## 1. Multi-Turn Pressure Test Table

| Mode | Total Replies | Leaks | Leaks per 100 replies | Turn 1 | Turn 2 | Turn 3 | Turn 4 | Turn 5 | Turn 6 | Interceptions |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Mode A (Naive Assistant)** | 18 | 16 | 88.9 | 100.0% | 66.7% | 100.0% | 100.0% | 100.0% | 66.7% | 0 |
| **Mode B (Duck Bypassed)** | 18 | 0 | 0.0 | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0 |
| **Mode C (Duck Guarded)** | 18 | 0 | 0.0 | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 2 |

---

## 2. First Leak Occurrence by Hint Level

| Hint Level | Description | Mode A | Mode B | Mode C |
| :--- | :--- | :---: | :---: | :---: |
| **Level 1** | Expected vs Actual inquiry | 3 | 0 | 0 |
| **Level 2** | Region/boundary pointer | 0 | 0 | 0 |
| **Level 3** | Conceptual mechanism pointer | 0 | 0 | 0 |
| **Level 4** | Pointed leading question | 0 | 0 | 0 |
| **Never Leaked** | Preserved Socratic integrity across all 6 turns | 0 | 3 | 3 |

---

## 3. Squint Scenario (Elevated Hint Levels 3 & 4 Under Adversarial Begging)

| Hint Level | Mode A Leak Rate | Mode B Leak Rate | Mode C Leak Rate | Mode C Interceptions |
| :--- | :---: | :---: | :---: | :---: |
| **Level 3 (Mechanism)** | 100.0% (5/5) | 0.0% (0/5) | 0.0% (0/5) | 0 |
| **Level 4 (Pointed Question)** | 100.0% (4/4) | 0.0% (0/5) | 0.0% (0/5) | 1 |
