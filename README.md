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

### Project Development Department — requirement 2

Set available hours separately for each weekday (default 08:00–22:00), a minimum free duration (default 30 minutes), and the maximum same-course break (default 10 minutes, configurable 0–60). Invalid settings hide results until corrected. Daily ranges and these settings persist locally under the `campus-gap-assistant:clock-*` prefix.

Same-name classes on the same weekday with breaks no longer than the configured value are merged for both display and calculation. For example, Monday Calculus 09:00–09:45 and 09:55–10:40 becomes 09:00–10:40, so the 10-minute class break is not reported as free. Different courses are not merged across a real break. Removing a displayed block removes all its source sessions; CSV export retains the original session records.

The algorithm uses integer minutes and half-open intervals `[start,end)`. It merges class sessions, clips occupied intervals to the available range, combines overlapping/touching occupied periods, then returns their complement. An empty day has the whole available range free; a fully occupied day has none. Sessions outside the range are ignored. With a one-minute minimum, every positive free interval is retained.

### Project Development Department — requirement 3

Add participants, select one, and manually enter or import that person's timetable. Up to 20 people are supported. Each person's timetable stays separate. A new, empty timetable is **unconfirmed**: it cannot silently contribute a full day of availability. Enter courses or explicitly confirm **No classes this week** before calculating common time. Removing a participant asks for confirmation. A three-person example is available while the initial timetable is empty.

Common free time intersects every participant's daily free intervals under the same configurable daily available ranges. Results sort by duration descending, then weekday and start time ascending. The weekday filter preserves that ordering. You can copy the filtered results as text. There is no booking, messaging, or calendar synchronization.

Participant data is stored under `campus-gap-assistant:clock-people:v1`. On first use, the requirement-1 clock timetable is copied into the first participant; its old `clock-courses:v1` storage is retained. Participant selection, daily windows, minimum duration and course-break settings also persist locally. The original period timetable is unchanged.

#### Manual acceptance examples

- Import `examples/pdd/timetable.csv`: Monday's Calculus sessions display as 09:00–10:40 with a 10-minute merge setting. With minimum 1, no 09:45–09:55 free slot appears. Set merge to 0 to show that break.
- Use available hours 08:00–22:00. An empty day returns 08:00–22:00; a class spanning the whole range returns no gap. Overlapping classes, courses touching at an endpoint, and classes outside the range must not create false gaps.
- Load the three-person example and filter common results to Monday: 15:30–22:00 (390 min), 12:00–14:00 (120 min), 08:00–09:00 (60 min), in that order. Add an unconfirmed person: common results are withheld until their timetable is provided or explicitly confirmed empty.
- Import an invalid end-before-start record: the error identifies its CSV record and no part of that import is appended. Reimporting an identical file does not add duplicates. Refresh to check persistence; compare Chinese, English and Russian interfaces.
- PRs are divided by the three requirements: input/CSV and weekly text, daily gaps and class merging, multi-person common gaps. Each PR adds its matching README section.

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
