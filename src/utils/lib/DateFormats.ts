export const timeSince = (dateIsoString: string): string => {
    const secondsPerMinute = 60;
    const secondsPerHour = 3600;
    const secondsPerDay = 86400;
    const secondsPerWeek = 604800;

    const date = new Date(dateIsoString);
    const now = new Date();

    const secondsElapsed = Math.round((now.getTime() - date.getTime()) / 1000);

    if (secondsElapsed < secondsPerMinute) {
        return "Just now";
    } else if (secondsElapsed < secondsPerHour) {
        return `${Math.floor(secondsElapsed / secondsPerMinute)} min`;
    } else if (secondsElapsed < secondsPerDay) {
        return `${Math.floor(secondsElapsed / secondsPerHour)} h`;
    } else if (secondsElapsed < secondsPerWeek) {
        return `${Math.floor(secondsElapsed / secondsPerDay)} d`;
    } else {
        return `${Math.floor(secondsElapsed / secondsPerWeek)} week`;
    }
}

// Examples
//   console.log(timeSince("2024-03-20T01:55:05.222Z")); // Just now
//   console.log(timeSince("2024-03-20T01:54:05.222Z")); // 1 min
//   console.log(timeSince("2024-03-20T00:55:05.222Z")); // 1 h
//   console.log(timeSince("2024-03-19T01:55:05.222Z")); // 1 d
//   console.log(timeSince("2024-03-13T01:55:05.222Z")); // 1 week

export function formatDateToHMS(): string {
    return `[${new Date().toLocaleTimeString()} INFO]`;
}