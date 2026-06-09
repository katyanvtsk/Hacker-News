export const formatDate = (item: number): string => {
  const date = new Date(item * 1000);
  const now = new Date();
  const diff = now.getTime() - date.getTime(); // разница в мс

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (minutes < 1) {
    return "только что";
  }
  if (hours < 1) {
    return `${minutes} минут назад`;
  }
  return date.toLocaleDateString("ru-RU");
};
