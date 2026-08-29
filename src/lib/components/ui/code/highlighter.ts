import javascript from '@shikijs/langs/javascript';
import json from '@shikijs/langs/json';
import shellscript from '@shikijs/langs/shellscript';
import svelte from '@shikijs/langs/svelte';
import typescript from '@shikijs/langs/typescript';
import githubDark from '@shikijs/themes/github-dark';
import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

export type CodeLanguage = 'svelte' | 'typescript' | 'javascript' | 'json' | 'shellscript' | 'text';

const highlighter = await createHighlighterCore({
	themes: [githubDark],
	langs: [svelte, typescript, javascript, json, shellscript],
	engine: createJavaScriptRegexEngine()
});

export function highlightCode(code: string, language: CodeLanguage) {
	return highlighter.codeToTokens(code.trimEnd(), {
		lang: language,
		theme: 'github-dark'
	}).tokens;
}

export function languageFromFilename(filename: string): CodeLanguage {
	if (filename.endsWith('.svelte')) return 'svelte';
	if (filename.endsWith('.ts')) return 'typescript';
	if (filename.endsWith('.js')) return 'javascript';
	if (filename.endsWith('.json')) return 'json';
	return 'text';
}
