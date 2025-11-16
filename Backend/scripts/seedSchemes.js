// scripts/seedSchemesFromFile.js
import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../db/index.js'; // adjust path if needed
import Schemev2 from '../models/schemev2.model.js';

const FILE = path.join(process.cwd(), 'seed', 'schemes.sample.json'); // change filename if needed

// Map file-format object -> Schemev2 shape
function mapFileToScheme(raw) {
  return {
    schemeName: raw.schemeName || raw.name || 'Unnamed Scheme',
    schemeShortTitle: raw.schemeShortTitle || raw.shortTitle || (raw.schemeName || '').slice(0, 80),
    state: raw.state || null,
    nodalMinistryName: raw.nodalMinistryName ? { label: raw.nodalMinistryName } : null,
    openDate: raw.openDate ? new Date(raw.openDate) : null,
    closeDate: raw.closeDate ? new Date(raw.closeDate) : null,
    tags: Array.isArray(raw.tags) ? raw.tags : (raw.tagList ? raw.tagList.split(',').map(t => t.trim()) : []),
    level: raw.level || null,
    schemeCategory: Array.isArray(raw.schemeCategory) ? raw.schemeCategory : (raw.categories ? raw.categories : []),
    references: Array.isArray(raw.references) ? raw.references.map(r => ({ title: r.title || '', url: r.url || r })) : [],
    detailedDescription_md: raw.detailedDescription_md || raw.description || '',
    applicationProcess: raw.applicationProcess || [],
    eligibilityDescription_md: raw.eligibilityDescription_md || raw.eligibility || '',
    benefits: raw.benefits || [],
    faqs: Array.isArray(raw.faqs) ? raw.faqs.map(f => ({ question: f.question, answer: f.answer })) : [],
    documents_required: Array.isArray(raw.documents_required) ? raw.documents_required.map(d => ({ name: d.name || '', url: d.url || '' })) : []
  };
}

async function seedFromFile() {
  try {
    if (!fs.existsSync(FILE)) {
      console.error('Seed file not found at', FILE);
      process.exit(1);
    }

    const raw = fs.readFileSync(FILE, 'utf8');
    const items = JSON.parse(raw);

    if (!Array.isArray(items) || items.length === 0) {
      console.error('Seed file is empty or not an array');
      process.exit(1);
    }

    await connectDB(); // ensure MONGO_URI is set in .env

    let count = 0;
    for (const rawItem of items) {
      const mapped = mapFileToScheme(rawItem);

      // Upsert using unique key schemeName + state (adjust if you want different key)
      await Schemev2.findOneAndUpdate(
        { schemeName: mapped.schemeName, state: mapped.state },
        { $set: mapped },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      count++;
      console.log(`[seed] upserted: ${mapped.schemeName} (${mapped.state || 'no-state'})`);
    }

    console.log(`Seeding complete — processed ${count} items.`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedFromFile();
