import { persisted } from 'svelte-persisted-store';

// Create a persistent store for analysis data
export const analysis = persisted('analysis', {
    summary: 'The summary goes here.',
    questions: 'Questions go here???'
});