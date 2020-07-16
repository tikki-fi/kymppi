import Col from "react-bootstrap/Col";
import React from "react";

export function parseDate(date) {
  if (!date) return Date();
  if (date instanceof Date) return date;
  if (typeof date === 'string') {
    if (date.includes('.')) {
      const dateSplit = date.split('.');
      return new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]);
    }
    if (date.includes('-')) {
      const dateSplit = date.split('-');
      return new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2]);
    }
  }
  throw Error('Unsupported date type: ' + date);
}

export function formatDate(date, format) {
  const d = date.getDate(); 
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  if (format === 'fin') {
    return d + '.' + m + '.' + y;
  }
  return y + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d;
}

export function formatSubtask(index, subtask) {
  let val = index + 1 + '. ';
  val += subtask.activityType + ', ';
  val += subtask.mechanism + ' ';
  val += subtask.caliber ? ' (' + subtask.caliber + ')' : undefined;
  val += ': ' + subtask.shots + ' kpl';
  val += subtask.distance ? ' (' + subtask.distance + (!isNaN(subtask.distance) ? ' m' : '') + ')' : undefined;
  return val;
}