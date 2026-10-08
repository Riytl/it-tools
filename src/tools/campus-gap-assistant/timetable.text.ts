import { useI18n } from 'vue-i18n';

const messages = {
  zh: {
    availability: '每天的可用时间', availabilityHint: '分别设置星期一至星期日的可用范围。时间用 HH:mm，结束可填 24:00；课程超出范围的部分不参与计算。', minimum: '最短空档（分钟）', gap: '同课程课间合并（分钟）', mergeHint: '同一天、名称相同的课程，间隔不超过此值时合并；课间不计为空闲。设为 0 可保留实际课间。', dailyFree: '每天的空闲时段', noFree: '没有符合时长要求的空档', minutes: '分钟', merged: '节已合并', removeBlock: '删除整段', err_settings: '请填写有效的每日起止时间；最短空档为 1–1440 分钟，课间合并为 0–60 分钟。',
    clockMode: '时刻课表', periodMode: '节次课表', title: '把本周课表整理清楚', intro: '手动录入或导入 CSV，生成可复制的本周课表。', privacy: '课表仅保存在当前浏览器，文件在本机解析。',
    entry: '录入课程', name: '课程名', placeholder: '例如：高等数学', day: '星期几', start: '开始时间', end: '结束时间', add: '添加课程', sample: '载入示例', remove: '删除',
    csvTitle: '从 CSV 导入', csvHint: 'UTF-8 CSV；含表头：课程名、星期几、开始时间、结束时间。星期用 1–7 或“星期一”，时间用 HH:mm。导入将追加课程，重复项会跳过。', choose: '选择 CSV 文件', paste: '或粘贴 CSV 内容', import: '导入课表', template: '下载示例 CSV', export: '导出当前 CSV', imported: '课表已导入，重复课程已跳过。', week: '本周课表', empty: '无课程', copy: '复制文本课表', copied: '已复制', count: '门课程',
    err_name: '课程名须为 1–100 个字符。', err_day: '星期须为 1–7、星期一至星期日或英文星期。', err_time: '时间须为有效的 HH:mm，结束可为 24:00。', err_order: '结束时间须晚于开始时间；请将跨天课程拆开。', err_header: '表头须包含课程名、星期几、开始时间、结束时间（也支持 name,day,start,end）。', err_columns: '每条课程记录须有 4 个字段。', err_quote: 'CSV 引号格式不完整或不正确。', err_empty: 'CSV 中没有课程记录。', err_large: 'CSV 不超过 1 MB 或 1000 条记录。', err_read: '读取文件失败，请选择 UTF-8 CSV 文件。', err_copy: '复制失败，请手动选中文本复制。', row: 'CSV 记录',
  },
  en: {
    availability: 'Daily available hours', availabilityHint: 'Set a range for each weekday using HH:mm (end may be 24:00). Parts of classes outside the range are ignored.', minimum: 'Minimum gap (minutes)', gap: 'Same-course break merge (minutes)', mergeHint: 'Same-name classes on the same day are joined when the break is at most this value. Set 0 to keep real breaks.', dailyFree: 'Daily free time', noFree: 'No gap meets the minimum duration', minutes: 'minutes', merged: 'sessions merged', removeBlock: 'Remove block', err_settings: 'Enter valid daily ranges, a minimum of 1–1440 minutes and a merge break of 0–60 minutes.',
    clockMode: 'Clock timetable', periodMode: 'Period timetable', title: 'Organize your weekly timetable', intro: 'Enter classes or import CSV to create a weekly text timetable.', privacy: 'Timetables stay in this browser; files are parsed locally.',
    entry: 'Add a class', name: 'Course name', placeholder: 'e.g. Calculus', day: 'Day', start: 'Start time', end: 'End time', add: 'Add class', sample: 'Load example', remove: 'Remove',
    csvTitle: 'Import CSV', csvHint: 'UTF-8 CSV with headers name,day,start,end (Chinese headers also supported). Use weekdays 1–7 and HH:mm times. Import appends classes and skips duplicates.', choose: 'Choose CSV file', paste: 'Or paste CSV text', import: 'Import timetable', template: 'Download example CSV', export: 'Export current CSV', imported: 'Imported; duplicate classes were skipped.', week: 'Weekly timetable', empty: 'No classes', copy: 'Copy text timetable', copied: 'Copied', count: 'classes',
    err_name: 'Course names must contain 1–100 characters.', err_day: 'Use weekdays 1–7, English names or Chinese weekdays.', err_time: 'Use valid HH:mm times; end time may be 24:00.', err_order: 'End must be later than start; split overnight classes.', err_header: 'Include exactly name,day,start,end or the equivalent Chinese headers.', err_columns: 'Each class record needs 4 fields.', err_quote: 'CSV quotes are incomplete or invalid.', err_empty: 'No class records found.', err_large: 'CSV must not exceed 1 MB or 1000 records.', err_read: 'Could not read the file. Choose a UTF-8 CSV.', err_copy: 'Copy failed; select and copy the text manually.', row: 'CSV record',
  },
  ru: {
    availability: 'Доступное время по дням', availabilityHint: 'Укажите диапазон для каждого дня в HH:mm (окончание может быть 24:00). Занятия вне диапазона не учитываются.', minimum: 'Минимальный промежуток (мин.)', gap: 'Объединять перерывы курса (мин.)', mergeHint: 'Занятия одного курса в один день объединяются, если перерыв не превышает это значение. 0 сохраняет реальные перерывы.', dailyFree: 'Свободное время по дням', noFree: 'Нет промежутков нужной длины', minutes: 'минут', merged: 'занятий объединено', removeBlock: 'Удалить блок', err_settings: 'Укажите допустимые диапазоны; минимум 1–1440 минут, объединение перерывов 0–60 минут.',
    clockMode: 'Расписание по времени', periodMode: 'Расписание по парам', title: 'Составьте расписание на неделю', intro: 'Введите занятия или импортируйте CSV, чтобы получить текстовое расписание.', privacy: 'Расписание хранится в этом браузере; файлы обрабатываются локально.',
    entry: 'Добавить занятие', name: 'Название курса', placeholder: 'Например, математика', day: 'День недели', start: 'Начало', end: 'Окончание', add: 'Добавить', sample: 'Загрузить пример', remove: 'Удалить',
    csvTitle: 'Импорт CSV', csvHint: 'CSV в UTF-8 с заголовками name,day,start,end. Дни: 1–7, время: HH:mm. Занятия добавляются, дубликаты пропускаются.', choose: 'Выбрать CSV', paste: 'Или вставьте текст CSV', import: 'Импортировать', template: 'Скачать пример CSV', export: 'Экспорт CSV', imported: 'Импорт завершен; дубликаты пропущены.', week: 'Расписание недели', empty: 'Нет занятий', copy: 'Копировать расписание', copied: 'Скопировано', count: 'занятий',
    err_name: 'Название должно содержать 1–100 символов.', err_day: 'Укажите день 1–7, английское или китайское название.', err_time: 'Используйте время HH:mm; окончание может быть 24:00.', err_order: 'Окончание должно быть позже начала. Разделите ночное занятие.', err_header: 'Нужны ровно четыре заголовка name,day,start,end или китайские эквиваленты.', err_columns: 'Для занятия нужны 4 поля.', err_quote: 'Неверные или незакрытые кавычки в CSV.', err_empty: 'В CSV нет занятий.', err_large: 'CSV не должен превышать 1 МБ или 1000 записей.', err_read: 'Не удалось прочитать файл. Выберите CSV в UTF-8.', err_copy: 'Не удалось скопировать; выделите и скопируйте вручную.', row: 'Запись CSV',
  },
};

export function useTimetableText() {
  const { locale } = useI18n();
  return (key: keyof typeof messages.zh) => {
    const language = locale.value.startsWith('zh') ? 'zh' : locale.value.startsWith('ru') ? 'ru' : 'en';
    return messages[language][key];
  };
}
