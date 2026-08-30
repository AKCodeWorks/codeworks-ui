<script lang="ts">
	import ArchiveIcon from '@lucide/svelte/icons/archive';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import FolderIcon from '@lucide/svelte/icons/folder';
	import FolderPlusIcon from '@lucide/svelte/icons/folder-plus';
	import ImageIcon from '@lucide/svelte/icons/image';
	import LinkIcon from '@lucide/svelte/icons/link';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import Share2Icon from '@lucide/svelte/icons/share-2';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import UserPlusIcon from '@lucide/svelte/icons/user-plus';
	import * as ContextMenu from '$lib/components/ui/context-menu';

	let folderName = $state('Campaign assets');
	let itemCount = $state(12);
	let archived = $state(false);
	let inTrash = $state(false);
	let activity = $state('No action selected yet.');

	function report(message: string) {
		activity = message;
	}

	function createItem(type: string) {
		itemCount += 1;
		report(`${type} created — this folder now contains ${itemCount} items.`);
	}
</script>

<div class="grid w-full max-w-lg gap-3">
	<ContextMenu.Root>
		<ContextMenu.Trigger
			class="grid h-56 w-full place-items-center rounded-xl border border-dashed border-border bg-card p-8 text-center shadow-sm transition-opacity select-none data-[state=open]:border-primary"
		>
			<div class:opacity-50={inTrash}>
				<FolderIcon class="mx-auto mb-3 size-8 text-muted-foreground" />
				<p class="font-medium">{folderName}</p>
				<p class="mt-1 text-sm text-muted-foreground">
					{itemCount} items{archived ? ' · Archived' : ''}{inTrash ? ' · In trash' : ''}
				</p>
				<p class="mt-3 text-xs text-muted-foreground">Right-click this folder</p>
			</div>
		</ContextMenu.Trigger>

		<ContextMenu.Content class="w-60">
			<ContextMenu.Item
				onSelect={() => {
					folderName = 'Campaign assets — edited';
					report('Folder renamed successfully.');
				}}
			>
				<PencilIcon />
				Rename
				<ContextMenu.Shortcut>↵</ContextMenu.Shortcut>
			</ContextMenu.Item>
			<ContextMenu.Item onSelect={() => report('A duplicate folder was created.')}>
				<CopyIcon />
				Duplicate
				<ContextMenu.Shortcut>⌘D</ContextMenu.Shortcut>
			</ContextMenu.Item>

			<ContextMenu.Sub>
				<ContextMenu.SubTrigger>
					<FolderPlusIcon />
					New
				</ContextMenu.SubTrigger>
				<ContextMenu.SubContent class="w-52">
					<ContextMenu.Item onSelect={() => createItem('Document')}>
						<FileTextIcon />Document
					</ContextMenu.Item>
					<ContextMenu.Item onSelect={() => createItem('Image')}>
						<ImageIcon />Image
					</ContextMenu.Item>
					<ContextMenu.Sub>
						<ContextMenu.SubTrigger>From source</ContextMenu.SubTrigger>
						<ContextMenu.SubContent class="w-48">
							<ContextMenu.Item onSelect={() => createItem('URL import')}>
								<LinkIcon />Import URL
							</ContextMenu.Item>
							<ContextMenu.Item onSelect={() => createItem('Pasted item')}>
								<CopyIcon />Paste content
							</ContextMenu.Item>
						</ContextMenu.SubContent>
					</ContextMenu.Sub>
				</ContextMenu.SubContent>
			</ContextMenu.Sub>

			<ContextMenu.Sub>
				<ContextMenu.SubTrigger>
					<Share2Icon />
					Share
				</ContextMenu.SubTrigger>
				<ContextMenu.SubContent class="w-48">
					<ContextMenu.Item onSelect={() => report('Invitation composer opened for this folder.')}>
						<UserPlusIcon />Invite people
					</ContextMenu.Item>
					<ContextMenu.Item onSelect={() => report('Share link copied to the clipboard (demo).')}>
						<LinkIcon />Copy link
					</ContextMenu.Item>
				</ContextMenu.SubContent>
			</ContextMenu.Sub>

			<ContextMenu.Separator />
			<ContextMenu.Item
				onSelect={() => {
					archived = !archived;
					report(archived ? 'Folder archived.' : 'Folder restored from the archive.');
				}}
			>
				<ArchiveIcon />{archived ? 'Unarchive' : 'Archive'}
			</ContextMenu.Item>
			<ContextMenu.Item
				variant="destructive"
				onSelect={() => {
					inTrash = true;
					report('Folder moved to trash. This is only a demo.');
				}}
			>
				<Trash2Icon />Move to trash
			</ContextMenu.Item>
		</ContextMenu.Content>
	</ContextMenu.Root>

	<div class="rounded-lg border border-border bg-muted/40 px-4 py-3" aria-live="polite">
		<p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">Latest action</p>
		<p class="mt-1 text-sm text-foreground">{activity}</p>
	</div>
</div>
