import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class FormatDateService {


public format(dateStr?: string): string {
  if (!dateStr) return '';

  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr  = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHr < 24) return `${diffHr}h`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d`;

  // لو التعليق قديم أكتر من أسبوع
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  if (now.getFullYear() !== date.getFullYear()) options.year = 'numeric';
  
  return date.toLocaleDateString(undefined, options);
}

}
