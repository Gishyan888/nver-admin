#!/usr/bin/env python3
"""Keeps the Nvér specs current inside a code repository.

The specs live in the folder specs/ of the code repository: a separate git repository that the
code repository ignores. It is a clone of the team's spec repository.

  python3 .claude/specs_sync.py                 update specs/ now
  python3 .claude/specs_sync.py setup           first time: fetch the specs
  python3 .claude/specs_sync.py hook            (session start hook)
  python3 .claude/specs_sync.py prompt          (prompt hook)

Standard library only. Never stops a session: on any problem it says so and goes on.
"""
import os
import re
import subprocess
import sys

TEAM_REPO = "https://github.com/TheShiftrTech/nver-specs.git"
REPO_NAME = "nver-specs"
HERE = os.path.dirname(os.path.abspath(__file__))
CODE = os.path.dirname(HERE) if os.path.basename(HERE) == ".claude" else os.getcwd()
SPECS = os.path.join(CODE, "specs")
ENV = dict(os.environ, GIT_TERMINAL_PROMPT="0")
ME = "python3 .claude/specs_sync.py"


def utf8_io():
    """Read and write text as UTF-8, whatever the code page of the machine. Called first in main().

    Claude Code and git use UTF-8. Python on Windows uses the machine's own code page for everything
    that is not a console window, so a letter such as "é" or a dash comes out broken or stops the
    script. A console window keeps its encoding; a character it cannot show is printed as "?".
    (The same function is in specs/team/devlog.py; this file is copied alone into a code repository.)
    """
    for stream, errors in ((sys.stdin, "replace"), (sys.stdout, "replace"), (sys.stderr, "backslashreplace")):
        try:
            if not stream.isatty():
                stream.reconfigure(encoding="utf-8", errors=errors)
            elif stream is not sys.stdin:
                stream.reconfigure(errors=errors)
        except (AttributeError, ValueError, OSError):   # no such stream, or not a text stream: leave it
            pass


def run(args, cwd=None, timeout=40):
    try:
        r = subprocess.run(args, cwd=cwd, capture_output=True, encoding="utf-8", errors="replace", env=ENV, timeout=timeout)
        return r.returncode, (r.stdout + r.stderr).strip()
    except Exception as e:
        return 1, str(e)


def git(*args, timeout=40):
    return run(["git", "-C", SPECS, *args], timeout=timeout)


def ssh_form(url):
    """The same repository address in the ssh form, for a machine where git works with an ssh key only."""
    return re.sub(r"^https://github\.com/", "git@github.com:", url)


def tail(url):
    """Owner and repository of an address, whatever its form or host name."""
    return re.sub(r"(\.git)?/?$", "", url or "").lower().replace(":", "/").split("/")[-2:]


def setup():
    if os.path.isdir(os.path.join(SPECS, ".git")):
        print("specs/ is already here. " + sync())
        return 0
    out = ""
    for url in (TEAM_REPO, ssh_form(TEAM_REPO)):
        code, out = run(["git", "clone", "--quiet", url, SPECS], timeout=120)
        if code == 0:
            print("specs/ is ready. " + sync())
            return 0
    print(f"Could not fetch {TEAM_REPO}\n{out}\nCheck that the PM gave you access to the team repository and that this machine is signed in to GitHub.")
    return 1


def use_team_repo():
    """A folder set up in the earlier way came from a personal copy (fork), with the team repository as
    'upstream'. Point origin at the team repository, in the form (https or ssh) git already works with
    here, and remove 'upstream'. Returns a line for the person when something was moved."""
    said = ""
    code, url = git("config", "--get", "remote.origin.url")
    if code == 0 and url and tail(url) != tail(TEAM_REPO):
        new = TEAM_REPO
        if not url.startswith("http"):   # ssh, or a host name of the person's own: keep it, change owner and repository
            m = re.match(r"^(.*[:/])[^/:]+/[^/]+$", url)
            new = m.group(1) + "/".join(TEAM_REPO[:-4].split("/")[-2:]) + ".git" if m else ssh_form(TEAM_REPO)
        git("remote", "set-url", "origin", new)
        said = "specs/ now works with the team repository directly; the personal copy (fork) is no longer used. "
    if "upstream" in git("remote")[1].split():
        git("remote", "remove", "upstream")
    return said


def sync():
    """Bring specs/ up to the team's latest. Returns one line for the person."""
    said = use_team_repo()
    code, out = git("fetch", "--quiet", "origin")
    if code != 0:
        return said + ("Specs not updated (could not reach the team repository): " + out.splitlines()[-1][:160] if out else "Specs not updated (could not reach the team repository).")
    branch = git("rev-parse", "--abbrev-ref", "HEAD")[1]
    behind = git("rev-list", "--count", "HEAD..origin/main")[1]
    if branch != "main":
        return said + (f"Specs are on branch {branch} (a result that is not sent yet). "
                f"The team's specs have {behind} newer change(s); they arrive after: python3 specs/team/result.py send")
    if behind in ("", "0"):
        return said + "Specs are up to date."
    if git("status", "--porcelain", "--untracked-files=no")[1]:
        return said + f"Specs NOT updated: {behind} newer change(s) wait, but specs/ has unsaved edits on main. Use result.py start before editing a card."
    old = git("rev-parse", "HEAD")[1]
    code, out = git("merge", "--quiet", "--ff-only", "origin/main")
    if code != 0:
        return said + ("Specs NOT updated: " + (out.splitlines()[-1][:160] if out else "merge failed"))
    files = [f for f in git("diff", "--name-only", old, "HEAD", "--", "features", "product", "constitution.md")[1].splitlines() if f]
    shown = ", ".join("specs/" + f for f in files[:8]) + (f" and {len(files) - 8} more" if len(files) > 8 else "")
    return said + (f"Specs updated: {behind} new change(s)" + (f" in {shown}." if files else "."))


def hook():
    if not os.path.isdir(os.path.join(SPECS, ".git")):
        print("Nvér SPECS — the folder specs/ is missing on this machine.\n"
              "The task cards and rules of Nvér live there. To get it, the person needs access to the team's "
              "spec repository (https://github.com/TheShiftrTech/nver-specs); the PM gives it. Then run:\n"
              f"  {ME} setup\n"
              "After that, read specs/CLAUDE.md and specs/README.md.")
        return 0
    print("Nvér SPECS — " + sync())
    code, out = run([sys.executable, os.path.join(SPECS, "team", "devlog.py"), "hook-start"], cwd=CODE)
    if out:
        print(out)
    return 0


def prompt():
    script = os.path.join(SPECS, "team", "devlog.py")
    if os.path.exists(script):
        data = sys.stdin.read() if not sys.stdin.isatty() else ""
        try:
            r = subprocess.run([sys.executable, script, "hook-prompt"], input=data, cwd=CODE, capture_output=True,
                               encoding="utf-8", errors="replace", timeout=10)
            if r.stdout.strip():
                print(r.stdout.strip())
        except Exception:
            pass
    return 0


def main():
    utf8_io()
    mode = sys.argv[1] if len(sys.argv) > 1 else "sync"
    try:
        if mode == "hook":
            return hook()
        if mode == "prompt":
            return prompt()
        if mode == "setup":
            return setup()   # a GitHub login given here, as the earlier setup asked, is not needed
        if not os.path.isdir(os.path.join(SPECS, ".git")):
            print(f"specs/ is missing. Run: {ME} setup")
            return 1
        print(sync())
        return 0
    except Exception as e:
        print(f"specs_sync: {e}", file=sys.stderr)
        return 0


if __name__ == "__main__":
    sys.exit(main())
