import type { Component } from 'svelte';
import type { InstallValue } from '$lib/components/ui/install';

export type ApiProperty = { name: string; type: string; default: string };

export type ComponentExample = {
	name: string;
	title: string;
	description?: string;
	demo: Component;
	demoSource: string;
};

export type ComponentDoc = {
	name: string;
	title: string;
	description: string;
	usage: string;
	api: ApiProperty[];
	demo: Component;
	demoSource: string;
	moreExamples: ComponentExample[];
	sources: Array<{ name: string; code: string }>;
	installValues: InstallValue[];
};
