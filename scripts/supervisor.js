#!/usr/bin/env node
/**
 * K-Empire Supervisor (The General) — reads teams.json, orchestrates team activation.
 * Usage:
 *   node scripts/supervisor.js run-team <projectId> <teamId> [taskDescription]
 *   node scripts/supervisor.js run-team myapproved SALES_TEAM "Generate leads for MyApproved"
 * Creates pending tasks in empire_tasks for each skill in the team; dashboard "Run" executes them.
 * Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and optionally NEXT_PUBLIC_SUPABASE_URL for Supabase.
 */

const path = require('path');
const fs = require('fs');

const CONFIG_PATH = path.join(__dirname, '..', 'config', 'teams.json');

function loadConfig() {
  const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
  const data = JSON.parse(raw);
  return data.empire_config || data;
}

function getTeamSkills(config, teamId) {
  const teams = config.teams || {};
  const team = teams[teamId];
  if (!team || !Array.isArray(team.skills)) return [];
  return team.skills;
}

async function createTasksViaApi(projectId, teamId, taskDescription, skills) {
  const base = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'http://localhost:3000';
  const url = `${base.startsWith('http') ? base : `https://${base}`}/api/empire/supervisor/run-team`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectId,
      teamId,
      taskDescription: taskDescription || `Run ${teamId} for ${projectId}`,
      skills,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`API ${res.status}: ${t}`);
  }
  return res.json();
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];
  if (cmd !== 'run-team') {
    console.log('Usage: node scripts/supervisor.js run-team <projectId> <teamId> [taskDescription]');
    console.log('Example: node scripts/supervisor.js run-team myapproved SALES_TEAM "Priority: generate leads"');
    process.exit(1);
  }

  const projectId = args[1];
  const teamId = args[2];
  const taskDescription = args[3] || `Run ${teamId} for ${projectId}`;

  if (!projectId || !teamId) {
    console.error('Missing projectId or teamId');
    process.exit(1);
  }

  const config = loadConfig();
  const domains = config.domains || [];
  if (!domains.includes(projectId)) {
    console.warn(`Warning: ${projectId} not in config.domains (${domains.join(', ')})`);
  }

  const skills = getTeamSkills(config, teamId);
  if (skills.length === 0) {
    console.error(`Unknown team or no skills: ${teamId}. Known: ${Object.keys(config.teams || {}).join(', ')}`);
    process.exit(1);
  }

  console.log(`Supervisor: Activating ${teamId} for ${projectId} (${skills.length} agents).`);
  try {
    const result = await createTasksViaApi(projectId, teamId, taskDescription, skills);
    console.log('Tasks created:', result.taskIds?.length ?? 0);
    if (result.logId) console.log('Log id:', result.logId);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

main();
