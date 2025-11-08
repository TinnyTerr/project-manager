# Project Manager

My project manager will manage each project over github.

On startup, it goes through the file-db (to be made nosql later) and updates all that need it (possibly add exact versioning later with commits and tags).

Then it goes through their data, checks if they need ports open, network access, file access, etc.

Goes to docker, spins them up, goes to traefik and adds ports. If there is a conflict, don't run both of them. (add a optional to each port, if one optional, let the one required person use it. if both optional, nobody uses it.)

# Start-up Process
1. Open db.
2. Get saved projects.
3. Parse args. Add/remove/modify projects as requested. Keep changes saved in temp. Exit here if args modifying projects
4. Check project folders.
5. Parse project data, ensure it matches.
	- Note, if missing or mismatched, overwrite using saved data, ignore temp.
6. Parse temp data, validate new data on a project by project basis
	- Like, if a project has an incorrect or inaccessible git repo, skip it, allow all the others to be modified.
7. Then, update.
8. Go through project data again, now checking for conflict, new stores in docker etc. Warn here of conflict. If several projects using the same store, also warn.
9. Then run docker containers and monitor.