export const appVersion = '2.1.0';
export const appBaseURI = 'http://3.112.45.170/vrecog';

export function dateToTime14(dt) {
	var mon = dt.getMonth() + 1,
      day = dt.getDate(),
      hour = dt.getHours(),
      min = dt.getMinutes(),
      sec = dt.getSeconds(),
      time14 = dt.getFullYear();
	time14 += (mon < 10 ? "0" : "") + mon;
	time14 += (day < 10 ? "0" : "") + day;
	time14 += (hour < 10 ? "0" : "") + hour;
	time14 += (min < 10 ? "0" : "") + min;
	time14 += (sec < 10 ? "0" : "") + sec;

	return time14;
}
