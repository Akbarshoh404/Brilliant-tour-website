export function formatDuration({ days, nights }, t) {
  return `${days} ${t('common.days')} / ${nights} ${t('common.nights')}`;
}
