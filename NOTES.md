# Sync

Sync project files to a backup location.

```bash
# dry run
rsync --dry-run --update -vhrz --progress --exclude-from 'exclude-list.txt' src_folder dest_folder

# sync
rsync --update -vhrz --progress --exclude-from 'exclude-list.txt' src_folder dest_folder
```
