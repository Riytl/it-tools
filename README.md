# Campus Toolbox

Campus Toolbox adapts the open-source [IT-Tools](https://github.com/CorentinTh/it-tools) project for university students. It brings study, writing, and campus-life utilities together in one responsive web app.

## Tools

- Timetable conflicts and free periods
- Grade averages and GPA conversion
- Attendance allowance calculator
- Exam, assignment, and campus-event planner
- Association document-format checklist
- Reference citation drafts for journals, books, and web pages (GB/T 7714 / APA templates; verify the result against the required edition)
- Shared-expense splitter
- Dorm chore rotation

The tools run in the browser. Timetables, planner items, checklists, expenses, and rotations are saved in the current browser's local storage. GPA conversion bands and document checklist items can be adjusted to local rules. Verify results against official school and course requirements.

## Product scope and evidence

This repository describes the implemented campus tools; it does not include student interview notes, trial results, or a comparison with similar web tools. Local browser use and the grouping of campus functions are implementation facts, not evidence that the product is more usable than alternatives. Avoid comparative usability claims until they are supported by student trials and task-based comparisons.

To evaluate that claim later, ask students to complete the same campus tasks with this toolbox and a comparable existing tool. Record task completion, time, input errors, and brief user feedback, then report the participant count and test conditions with the results.

The reference formatter produces drafts from the fields entered by the user. It does not automatically normalize author names or verify every requirement of a particular GB/T 7714 or APA edition, so users should check the generated citation against the required style guide and their department's rules.

## Visual design

The interface draws its navy, blue, crimson, and coral palette from [Shenzhen MSU-BIT University's published visual identity colors](https://www.smbu.edu.cn/sjxxsb/bz_xh.htm). The RGB values in `src/ui/theme/campus-palette.ts` are sampled from the school's online color chart for screen use. The toolbox uses its own layout and does not present itself as an official university service.

## Development

### Project Development Department — requirement 1

Open `/campus-gap-assistant` and select **Clock timetable / 时刻课表**. Add a course with a weekday and `HH:mm` times, or import/paste a UTF-8 CSV. The weekly timetable lists Monday through Sunday and provides a copyable text view. The existing period timetable keeps its separate storage and week-parity settings.

CSV must contain exactly four headers, in any order: `课程名,星期几,开始时间,结束时间` or `name,day,start,end`. Weekdays accept 1–7 (Monday–Sunday), Chinese weekday labels, or English weekday names. Times require two-digit hours and minutes; `24:00` is permitted only as an end time. Overnight courses must be split by day.

See [example CSV](examples/pdd/timetable.csv). The importer handles UTF-8 BOM, CRLF, quoted commas, escaped quotes, and quoted newlines. It validates all records before appending anything, reports the CSV record containing an error, and skips exact duplicate classes. Files are limited to 1 MB and 1000 records. Download an example or export the active timetable from the page.

Clock courses are stored under `campus-gap-assistant:clock-courses:v1`. No account or server is required; course names and uploaded CSV contents stay in the browser. This view describes one recurring weekly schedule; use the original **Period timetable** view for semester weeks and odd/even-week rules.

```bash
pnpm install
pnpm dev
```

To create a production build:

```bash
pnpm build
```

## License and attribution

This project is based on IT-Tools and remains under the GNU GPL v3. Keep the original copyright and license notices when modifying or redistributing it. When distributing this browser app, provide the corresponding source for the modified version and its license information alongside the app. See [LICENSE](LICENSE) and the [GitHub repository](https://github.com/Riytl/it-tools).

The GPL and AGPL have different network-use terms. The GPL does not add the AGPL's source-offer requirement merely because a modified server program is hosted on a website. This project delivers JavaScript to visitors' browsers, so publishing a modified version of the app is distribution; make its corresponding source available under the GPL. See the GNU [GPL FAQ](https://www.gnu.org/licenses/gpl-faq.en.html#UnreleasedMods) for the distinction.
